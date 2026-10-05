import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set, update } from 'firebase/database';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, database } from '../config/firebase';
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
        const userRef = ref(database, `users/${firebaseUser.uid}`);
        const userSnapshot = await get(userRef);
        const profile = userSnapshot.exists() ? userSnapshot.val() : { role: initialRole };
        const userRole = profile.role || initialRole;

        if (!userSnapshot.exists()) {
          await set(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            role: userRole,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        if (mounted) {
          setUser({ ...baseUser, profile: { ...profile, role: userRole } });
          setRole(userRole);
        }
      } catch (error) {
        console.error('Could not load Realtime Database profile:', error);
      } finally { finishStartup(); }
    };

    startupTimer = setTimeout(() => {
      console.warn('Firebase auth startup timed out; showing the public app.');
      finishStartup();
    }, 4000);
    let unsubscribe;
    try { unsubscribe = onAuthStateChanged(auth, hydrateUser); }
    catch (error) { console.error('Firebase Auth failed to initialize:', error); finishStartup(); }
    return () => { mounted = false; clearTimeout(startupTimer); unsubscribe?.(); };
  }, []);

  const ensureUserDoc = async (firebaseUser, extra = {}) => {
    try {
      const userRef = ref(database, `users/${firebaseUser.uid}`);
      const existing = await get(userRef);
      const email = (firebaseUser.email || '').toLowerCase();
      const isAdmin = email.includes('admin') || email.endsWith('@veloxpark.com');
      const existingData = existing.exists() ? existing.val() : null;
      const assignedRole = existingData?.role || (isAdmin ? 'admin' : 'user');

      const updateData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || extra.name || '',
        role: assignedRole,
        updatedAt: new Date().toISOString(),
        ...extra,
      };

      if (existing.exists()) {
        await update(userRef, updateData);
      } else {
        await set(userRef, {
          ...updateData,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('ensureUserDoc notice:', e);
    }
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
