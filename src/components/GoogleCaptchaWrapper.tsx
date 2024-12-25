"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React from "react";
import { APP_CONFIGS } from "@/config-global";

export default function GoogleCaptchaWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const recaptchaKey: string | undefined = APP_CONFIGS.recaptchaPublicKey;

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey ?? "NOT DEFINED"}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
