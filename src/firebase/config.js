// Import the Firebase modules we need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase config
// Replace these with your real values from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCcYDLdMi53cAxQE6uDSq0hRAQYE5L_X0k",
  authDomain: "basiclogin-bc302.firebaseapp.com",
  projectId: "basiclogin-bc302",
  storageBucket: "basiclogin-bc302.appspot.com",
  messagingSenderId: "7578565990",
  appId: "1:7578565990:web:37649ccf1c2026d1b9dca7",
  measurementId: "G-BTB3LB0F1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: analytics
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the app itself (optional)
export default app;
