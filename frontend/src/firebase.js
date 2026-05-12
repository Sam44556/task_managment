// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "stse-3727d.firebaseapp.com",
  projectId: "stse-3727d",
  storageBucket: "stse-3727d.firebasestorage.app",
  messagingSenderId: "839422589885",
  appId: "1:839422589885:web:453b97e22b8625a8a1f0d4",
  measurementId: "G-E8HBN3J98G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
