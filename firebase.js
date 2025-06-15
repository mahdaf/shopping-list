// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth"; 

// Only define mocks in test environment
let mockAuth, mockDb;
if (process.env.NODE_ENV === 'test') {
  mockAuth = {
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
    currentUser: {
      uid: 'test-uid',
      email: 'test@example.com'
    }
  };

  mockDb = {
    collection: jest.fn(() => ({
      add: jest.fn(),
      doc: jest.fn(),
      where: jest.fn(),
      get: jest.fn(),
      onSnapshot: jest.fn()
    }))
  };
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = process.env.NODE_ENV === 'test' ? mockDb : getFirestore(app);
const auth = process.env.NODE_ENV === 'test' ? mockAuth : getAuth(app);

// memaksa session hanya berlaku per tab (bukan permanen)
if (process.env.NODE_ENV !== 'test') {
  setPersistence(auth, browserSessionPersistence).catch((err) => {
    console.error("Gagal set session persistence:", err);
  });
}

export { db, auth };