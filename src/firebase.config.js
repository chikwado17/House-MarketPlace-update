// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAEK-NcaJo4QZF4Ev7b5mtcarYPUFvwuyc",
  authDomain: "house-marketplace-app-a01f9.firebaseapp.com",
  projectId: "house-marketplace-app-a01f9",
  storageBucket: "house-marketplace-app-a01f9.appspot.com",
  messagingSenderId: "170272271143",
  appId: "1:170272271143:web:de9e72a289b59b27cbd702",
  measurementId: "G-19H7VC4EPW"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();