import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { AuthContext } from './AuthContextValue';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let startupTimer;
    const finishStartup = () => {
      clearTimeout(startupTimer);
      if (mounted) setLoading(false);
    };
    const hydrateUser = async (firebaseUser) => {
      if (!firebaseUser) {
        if (mounted) { setUser(null); setRole(null); }
        finishStartup();
        return;
      }
      const email = (firebaseUser.email || '').toLowerCase();
      const isAdmin = email.includes('admin') || email.endsWith('@veloxpark.com');
      const initialRole = isAdmin ? 'admin' : 'user';

      const baseUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        profile: { role: initialRole },
        firebaseUser,
      };

      if (mounted) {
        setUser(baseUser);
        setRole(initialRole);
      }

      try {
        const userSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
        const profile = userSnapshot.exists() ? userSnapshot.data() : { role: initialRole };
        const userRole = profile.role || initialRole;

        if (!userSnapshot.exists()) {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            role: userRole,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        if (mounted) {
          setUser({ ...baseUser, profile: { ...profile, role: userRole } });
          setRole(userRole);
        }
      } catch (error) {
        console.error('Could not load Firestore profile:', error);
      } finally { finishStartup(); }
    };

    startupTimer = setTimeout(() => {
      console.warn('Firebase auth startup timed out; showing the public app.');
      finishStartup();
    }, 8000);
    let unsubscribe;
    try { unsubscribe = onAuthStateChanged(auth, hydrateUser); }
    catch (error) { console.error('Firebase Auth failed to initialize:', error); finishStartup(); }
    return () => { mounted = false; clearTimeout(startupTimer); unsubscribe?.(); };
  }, []);

  const ensureUserDoc = async (firebaseUser, extra = {}) => {
    const existing = await getDoc(doc(db, 'users', firebaseUser.uid));
    const email = (firebaseUser.email || '').toLowerCase();
    const isAdmin = email.includes('admin') || email.endsWith('@veloxpark.com');
    const assignedRole = existing.exists() ? (existing.data().role || (isAdmin ? 'admin' : 'user')) : (isAdmin ? 'admin' : 'user');

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || extra.name || '',
      role: assignedRole,
      updatedAt: serverTimestamp(),
      ...extra,
    }, { merge: true });
  };

  const value = useMemo(() => ({
    user,
    role,
    loading,
    signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signUp: async (email, password, name) => {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(result.user, { displayName: name });
      await ensureUserDoc(result.user, { name: name || '' });
      return result;
    },
    signInWithGoogle: async () => {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await ensureUserDoc(result.user);
      return result;
    },
    signOut: () => signOut(auth),
  }), [loading, role, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
