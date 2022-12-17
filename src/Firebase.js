// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkKDY4wuTImdzxsfNkqTJZnyqEG44-4wg",
  authDomain: "mytube-49342.firebaseapp.com",
  projectId: "mytube-49342",
  storageBucket: "mytube-49342.appspot.com",
  messagingSenderId: "139653095001",
  appId: "1:139653095001:web:3554fdee4fb8fe97319b48",
  measurementId: "G-8QX6WMWJQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();



export {app, db, storage, auth, provider};