import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "web-ragamint.firebaseapp.com",
  projectId: "web-ragamint",
  storageBucket: "web-ragamint.firebasestorage.app",
  messagingSenderId: "687933826584",
  appId: "1:687933826584:web:df563d08ec82380b80056d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
