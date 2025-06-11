import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"


export function LoginForm({ className, ...props }) {


  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6 font-dmsans", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign In to your account</h1>
      </div>

      <div className="grid gap-2">
        <div className="grid gap-3">
          <Label htmlFor="mobile">Mobile No</Label>
          <Controller
            name="phone_no"
            control={control}
            rules={{ required: "Valid Phone No is required !!" }}
            render={({ field }) => (
              <PhoneInput
                country={'in'}
                inputStyle={{width: "100%", border: "1px solid #b1aeae545", height: "50px", fontSize: "25px", fontFamily: "'DM Sans', sans-serif" , fontWeight: "500"}}
                placeholder="e.g. +91XXXXXXXXXX"
                {...field}
                onChange={(phone) => field.onChange(phone)}
              />
            )}
          />
          {/* <Input
            id="mobile"
            type="tel"
            placeholder="e.g. +91XXXXXXXXXX"
            
          /> */}
          {errors.phone_no && (
            <p className="text-red-500 text-sm">{errors.phone_no.message}</p>
          )}
        </div>

        <div id="recaptcha-container" />

        <Button type="submit" className="w-full uppercase">
          Send OTP via SMS
        </Button>
      </div>
    </form>
  );
}
