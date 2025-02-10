// Import the necessary functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeNCF0Ji4ZGtDnJX-5PLJi6d3xaf5KSy8",
  authDomain: "hullu-25607.firebaseapp.com",
  projectId: "hullu-25607",
  storageBucket: "hullu-25607.appspot.com",  
  messagingSenderId: "1034438764899",
  appId: "1:1034438764899:web:48671d018f8283b40d8b56",
  measurementId: "G-7HKL550LNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);  

export { app, analytics };  