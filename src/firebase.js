// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQsePLKARProMOag3l_nEiiq3ji3PiMLU",
  authDomain: "twitter-app-4eac7.firebaseapp.com",
  projectId: "twitter-app-4eac7",
  storageBucket: "twitter-app-4eac7.firebasestorage.app",
  messagingSenderId: "675476538395",
  appId: "1:675476538395:web:3263db8b7bbc123f1364be"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);