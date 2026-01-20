import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWlIJTObwWu3NrmrRH_hO0waXaDAUemx4",
  authDomain: "teamminy-81323.firebaseapp.com",
  projectId: "teamminy-81323",
  storageBucket: "teamminy-81323.firebasestorage.app",
  messagingSenderId: "919342320204",
  appId: "1:919342320204:web:63924c7e5f37be2a1f82e9",
  measurementId: "G-VBFDQ1PX48",
  databaseURL: "https://teamminy-81323-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const messaging = getMessaging(app);

export default app;
