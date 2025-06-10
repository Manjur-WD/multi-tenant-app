import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { auth, recaptcha } from "@/lib/firebase";
import { signInWithPhoneNumber } from "firebase/auth";

export function LoginForm({ className, ...props }) {
  const [phone, setPhone] = React.useState("");
  const [step, setStep] = React.useState("phone"); // "phone" or "otp"
  const [confirmationResult, setConfirmationResult] = React.useState(null);

  // Handle reCAPTCHA + send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!phone.match(/^\+91\d{10}$/)) {
      alert("Please enter a valid Indian phone number starting with +91.");
      return;
    }

    try {
      const appVerifier = recaptcha(); // invisible
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
    } catch (error) {
      console.error("Failed to send OTP:", error);
      alert(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSendOtp}
      className={cn("flex flex-col gap-6 font-dmsans", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign In to your account</h1>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="mobile">Mobile No</Label>
          <Input
            id="mobile"
            type="tel"
            placeholder="e.g. +91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div id="recaptcha-container" />

        <Button type="submit" className="w-full uppercase">
          Send OTP
        </Button>
      </div>
    </form>
  );
}
