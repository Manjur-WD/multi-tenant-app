import { auth, recaptcha } from "../lib/firebase";
import {
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

// Store confirmation result in memory or context
let confirmationResult = null;

// 🟢 Step 1: Send OTP
export const sendOtp = async (phoneNumber, recaptchaContainerId = "recaptcha-container") => {
  const verifier = recaptcha(recaptchaContainerId);
  console.log(verifier);
  
  confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
  return true;
};

// 🟡 Step 2: Verify OTP
export const verifyOtp = async (otp) => {
  if (!confirmationResult) throw new Error("OTP not sent yet");
  const result = await confirmationResult.confirm(otp);
  return result.user;
};

// 🔄 Monitor Auth State
export const listenToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// 🚪 Sign out
export const logout = async () => {
  await signOut(auth);  
};