"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React, { useState } from "react";

import facebookSvg from "@/images/Facebook.svg";
import googleSvg from "@/images/Google.svg";
import twitterSvg from "@/images/Twitter.svg";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
// auth
import { GoogleLogin } from "@react-oauth/google";
import { useAuthContext } from "@/auth/useAuthContext";
import { PATH_AUTH } from "@/contains/paths";
import GuestGuard from "@/auth/GuestGuard";
import { useTranslation } from "@/app/i18n/client";
import RHFTextField from "@/components/RHFTextField";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { RECAPTCHA_ACTION } from "@/constants";

export interface LoginProps {}

export interface LoginFormData {
  email: string;
  password: string;
}

const loginSocials = [
  {
    name: "Continue with Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Continue with Twitter",
    href: "#",
    icon: twitterSvg,
  },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];

const Login: FC<LoginProps> = ({}) => {
  const { t } = useTranslation(["common", "auth"]);
  const { getRecaptchaToken } = useRecaptcha();
  const { loginWithGoogle, login } = useAuthContext();
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>();

  const handleGoogleLogin = async (token: string) => {
    try {
      if (loginWithGoogle) {
        await loginWithGoogle(token);
      }
      console.log("GOOGLE LOGIN");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginEmail = async () => {
    const recaptchaToken = await getRecaptchaToken(RECAPTCHA_ACTION.login);
    setIsLoading(true);
    setNotification(null);
    const { email, password } = getValues();
    if (login) {
      try {
        await login(email, password, recaptchaToken);
      } catch (error: any) {
        if (error.message === "user_not_verified") {
          showToast("info", t("auth:checkEmailVerify"));
          setNotification(t("auth:checkEmailVerify"));
          return;
        }
        if (error.message === "invalid_email_or_password") {
          showToast("error", t("auth:invalidEmailOrPassword"));
          setNotification(t("auth:invalidEmailOrPassword"));
          return;
        }
        showToast("error", t("auth:loginFail"));
        setNotification(t("auth:loginFail"));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="nc-Login">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-16 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          {t("common:auth.login")}
        </h2>
        <div className="mx-auto max-w-md space-y-6">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleGoogleLogin(credentialResponse?.credential ?? "")
              }
              onError={() => {
                setNotification(t("auth:loginFail"));
              }}
              useOneTap
            />
          </div>
          <div className="grid gap-3">
            {/*{loginSocials.map((item, index) => (*/}
            {/*  <a*/}
            {/*    key={index}*/}
            {/*    href={item.href}*/}
            {/*    className="flex w-full rounded-lg bg-primary-50 px-4 py-3 transition-transform hover:translate-y-[-2px] dark:bg-neutral-800 sm:px-6"*/}
            {/*  >*/}
            {/*    <Image className="shrink-0" src={item.icon} alt={item.name} />*/}
            {/*    <h3 className="grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">*/}
            {/*      {item.name}*/}
            {/*    </h3>*/}
            {/*  </a>*/}
            {/*))}*/}
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block bg-white px-4 text-sm font-medium dark:bg-neutral-900 dark:text-neutral-400">
              {t("common:or")}
            </span>
            <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border border-neutral-100 dark:border-neutral-800" />
          </div>
          {/* FORM */}
          <form
            className="grid grid-cols-1 gap-6"
            onSubmit={handleSubmit(handleLoginEmail)}
          >
            {/* <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(() => console.log(getValues()))}> */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                {t("auth:emailAddress")}
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                onFocus={() => {
                  setNotification(null);
                }}
                {...register("email", { required: t("auth:emailRequired") })}
              />
              {/* Display validation error message */}
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </label>
            <label className="block">
              <span className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
                {t("auth:password")}
                <Link
                  href={PATH_AUTH.forgotPassword}
                  className="text-sm font-medium underline"
                >
                  {t("auth:forgotPassword")}
                </Link>
              </span>
              <Input
                type="password"
                {...register("password", {
                  required: t("auth:passwordRequired"),
                })}
                onFocus={() => {
                  setNotification(null);
                }}
                className="mt-1"
              />
              {/* Display validation error message */}
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </label>
            {notification && (
              <p className="text-center font-medium text-red-500">
                {notification}
              </p>
            )}
            <ButtonPrimary loading={isLoading} type="submit">
              {t("common:auth.login")}
            </ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            {t("auth:notHaveAccount")} {` `}
            <Link href={PATH_AUTH.register} className="font-semibold underline">
              {t("auth:createAccount")}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
