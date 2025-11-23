// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCag7X3TOgbKgjqbMlDC4D9nMtnZSwxF4M",
  authDomain: "jar-commit-proto.firebaseapp.com",
  projectId: "jar-commit-proto",
  storageBucket: "jar-commit-proto.firebasestorage.app",
  messagingSenderId: "325052453498",
  appId: "1:325052453498:web:fd0ef0bc18599ed97521c3",
  measurementId: "G-R8NF5KT66V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
