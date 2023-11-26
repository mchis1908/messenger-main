// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7VZZiQz7eRuNC36_I8OoclY3Vy_pCYVU",
  authDomain: "talk-time-23c0d.firebaseapp.com",
  databaseURL: "https://talk-time-23c0d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "talk-time-23c0d",
  storageBucket: "talk-time-23c0d.appspot.com",
  messagingSenderId: "67276977534",
  appId: "1:67276977534:web:0bc7b70f6d0e4a9b5d2f2f",
  measurementId: "G-3DQSMLYR0E"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const REAL_TIME_DATABASE = getDatabase(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP, "gs://talk-time-23c0d.appspot.com");
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);