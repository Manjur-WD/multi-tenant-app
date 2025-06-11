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
  apiKey: "AIzaSyAHsDHFWTLc57ghsiMp-BHaLG-3G2Lm8cs",
  authDomain: "multitenantapp-824d4.firebaseapp.com",
  projectId: "multitenantapp-824d4",
  storageBucket: "multitenantapp-824d4.firebasestorage.app",
  messagingSenderId: "515724587389",
  appId: "1:515724587389:web:a9a3fb219bd25105869c14",
  measurementId: "G-6ZEW2M0SS4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const recaptcha = (id = "recaptcha-container") =>
    new RecaptchaVerifier(id, { size: "invisible" }, auth);

export const db = getFirestore(app);


