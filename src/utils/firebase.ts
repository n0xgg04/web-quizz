// Import the functions you need from the SDKs you need
"use client";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCI8XlBjafE-8BY1Kfcj_BvAwd2dsQGtmI",
  authDomain: "web-4fd21.firebaseapp.com",
  projectId: "web-4fd21",
  storageBucket: "web-4fd21.firebasestorage.app",
  messagingSenderId: "251127005472",
  appId: "1:251127005472:web:4116b78af8b2d3a5f15745",
  measurementId: "G-DRJNHEP2X8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : undefined;

export { app, analytics };
