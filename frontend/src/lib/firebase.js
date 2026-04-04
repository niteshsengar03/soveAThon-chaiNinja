import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'databaseURL',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingFirebaseConfig = requiredKeys.some((key) => !firebaseConfig[key]);

const app = !missingFirebaseConfig
  ? (getApps()[0] || initializeApp(firebaseConfig))
  : null;

const db = app ? getFirestore(app) : null;
const realtimeDb = app ? getDatabase(app) : null;

export { db, realtimeDb, missingFirebaseConfig };
