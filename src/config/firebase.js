// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDG86kDuFRbaVfvV__chQd_INtadFQnRtM",
  authDomain: "parking-system-939dd.firebaseapp.com",
  databaseURL: "https://parking-system-939dd-default-rtdb.firebaseio.com",
  projectId: "parking-system-939dd",
  storageBucket: "parking-system-939dd.firebasestorage.app",
  messagingSenderId: "1026746170660",
  appId: "1:1026746170660:web:2eaa4bd8ab535139a947b1",
  measurementId: "G-PXDDGPPYJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
