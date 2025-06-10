// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBfinmzPnbow8yUerFDfhqPWCdfHN6EqrM",
    authDomain: "multitenantproductapp.firebaseapp.com",
    projectId: "multitenantproductapp",
    storageBucket: "multitenantproductapp.firebasestorage.app",
    messagingSenderId: "352901460305",
    appId: "1:352901460305:web:ab81ba05ed0bd2dff4a370",
    measurementId: "G-ZYQ4QWD03G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const recaptcha = (id = "recaptcha-container") =>
    new RecaptchaVerifier(id, { size: "invisible" }, auth);

export const db = getFirestore(app);


