import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAGBxxHAzSw5SfP5Nl5Pv0I6sVyn0VLyws",
  authDomain: "bbd-admin-687fb.firebaseapp.com",
  projectId: "bbd-admin-687fb",
  storageBucket: "bbd-admin-687fb.firebasestorage.app",
  messagingSenderId: "22259820139",
  appId: "1:22259820139:web:ce59458e768e713a32732e"
};

// Only initialize if not already initialized (hot reload safe)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
