// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth"; // ⬅️ tambahkan ini

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9lA_bmun3Ut9pQzDGEEHJj8g4cVhv2bY",
  authDomain: "shop-list-21b61.firebaseapp.com",
  projectId: "shop-list-21b61",
  storageBucket: "shop-list-21b61.firebasestorage.app",
  messagingSenderId: "126957179207",
  appId: "1:126957179207:web:2dbc520694c12a6f16bc62",
  measurementId: "G-N9QM41ZZ60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);

// ✅ tambahkan ini untuk paksa session hanya berlaku per tab (bukan permanen)
setPersistence(auth, browserSessionPersistence).catch((err) => {
  console.error("Gagal set session persistence:", err);
});

export { db, auth };