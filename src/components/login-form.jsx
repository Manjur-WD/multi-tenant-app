import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"
import { useMutation } from "@tanstack/react-query";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { sendOtp, verifyOtp } from "../services/authService";
import { AuthContext } from "../context/AuthGlobalContext";
import { useNavigate } from "react-router-dom";


export function LoginForm({ className, ...props }) {

  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  // console.log(setUser);

  const navigate = useNavigate();


  const [step, setStep] = useState(1);
  const { register, control, handleSubmit, formState: { errors } } = useForm();

  const sendOtpMutation = useMutation({
    mutationFn: async ({ phone }) => await sendOtp(phone, "recaptcha-container"),
    onSuccess: () => setStep(2),
    onError: (error) => {
      console.error(error);
      setError("phone", { message: "Failed to send OTP" });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ otp }) => await verifyOtp(otp),
    onSuccess: (user) => {
      console.log("Logged in:", user);
      setUser(user);
      setIsAuthenticated(true);
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
      setError("otp", { message: "Invalid OTP" });
    },
  });

  const onSubmit = (data) => {
    if (step === 1) {
      sendOtpMutation.mutate({ phone: `+${data.phone}` });
      console.log("Sending OTP to:", `+${data.phone}`);

    } else {
      verifyOtpMutation.mutate({ otp: data.otp });
      console.log("Verifying OTP:", data.otp);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-2 font-dmsans", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign In to your account</h1>
      </div>
      {
        step === 1 ? (
          <div className="grid gap-5">
            <div className="grid gap-3">
              <Label htmlFor="mobile" className="text-center block">Enter Mobile No</Label>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Valid Phone No is required !!", minLength: {
                    value: 10,
                    message: "Phone number must be at least 10 digits long"
                  }, pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Phone number must be a valid number with 10 to 15 digits"
                  }
                }}
                render={({ field }) => (
                  <PhoneInput
                    country={'in'}
                    inputStyle={{ width: "100%", border: "1px solid #b1aeae545", height: "50px", fontSize: "25px", fontFamily: "'DM Sans', sans-serif", fontWeight: "500" }}
                    placeholder="e.g. +91XXXXXXXXXX"
                    {...field}
                    onChange={(phone) => field.onChange(phone)}
                  />
                )}
              />

              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div className="flex justify-center items-center">
              <div id="recaptcha-container" />
            </div>

            <Button type="submit" className="w-full uppercase">
              {
                sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP via SMS"
              }
            </Button>
          </div>
        ) :
          (
            <div className="grid gap-5">
              <div className="grid gap-3">
                <Label htmlFor="otp" className="text-center block">Enter the otp</Label>
                <div className="flex items-center justify-center">
                  <InputOTP maxLength={6} className="w-full" {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "OTP must be a 6-digit number"
                    },
                    minLength: {
                      value: 6,
                      message: "OTP must be 6 digits long"
                    }
                  })} onChange={(e) => {
                    console.log(e);
                  }}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {errors.otp && (
                  <p className="text-red-500 text-sm">{errors.otp.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full uppercase">
                {verifyOtpMutation.isPending ? "Validating OTP..." : "Validate OTP"}
              </Button>

            </div>
          )
      }
    </form>
  );
}