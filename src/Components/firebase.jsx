// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { arrayUnion } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCs1crb1G-bfCT9BuhYhF63oGfR-cpMnJw",
  authDomain: "eventure-8632c.firebaseapp.com",
  projectId: "eventure-8632c",
  storageBucket: "eventure-8632c.firebasestorage.app",
  messagingSenderId: "89450010894",
  appId: "1:89450010894:web:ba8abbd82d3dffe1f05f5f",
  measurementId: "G-GGTVDL76NC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;