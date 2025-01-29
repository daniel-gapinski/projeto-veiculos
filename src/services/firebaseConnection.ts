
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDnoj5UNXzBG7c9ZSzHZFSVg4YNhTEmMs8",
  authDomain: "wp-veiculos.firebaseapp.com",
  projectId: "wp-veiculos",
  storageBucket: "wp-veiculos.firebasestorage.app",
  messagingSenderId: "419383151902",
  appId: "1:419383151902:web:1f5979c99d102fdaf04d0f",
  measurementId: "G-C8WEL03G30"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };