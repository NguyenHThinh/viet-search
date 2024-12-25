"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React, { useEffect, useState } from "react";

import facebookSvg from "@/images/Facebook.svg";
import googleSvg from "@/images/Google.svg";
import twitterSvg from "@/images/Twitter.svg";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthContext } from "@/auth/useAuthContext";
import { useTranslation } from "@/app/i18n/client";
import { useForm } from "react-hook-form";
import Logo from "@/shared/Logo";
import { PATH_AUTH } from "@/contains/paths";
import { useToast } from "@/hooks/useToast";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { RECAPTCHA_ACTION } from "@/constants";
import { sendVerifyEmail } from "@/services/auth";

export interface RegisterProps {}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
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

const Register: FC<RegisterProps> = ({}) => {
  const { t, i18n } = useTranslation(["common", "auth"]);
  const { loginWithGoogle, userRegister } = useAuthContext();
  const { getRecaptchaToken } = useRecaptcha();
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveResend, setIsActiveResend] = useState(false);
  const [registerState, setRegisterState] = useState<{ email: string | null }>({
    email: null,
  });

  //
  const { showToast } = useToast();

  const {
    trigger,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>();

  // scroll top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [registerState]);

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

  const handleResendVerifyEmail = async () => {
    if (!registerState.email) return;

    const recaptchaToken = await getRecaptchaToken(
      RECAPTCHA_ACTION.verifyAccountEmail,
    );
    try {
      await sendVerifyEmail(registerState.email, i18n.language, recaptchaToken);
      showToast("success", t("auth:verifySuccess"));
      // set disable resend button only using 1 time
      setIsActiveResend(true);
    } catch (error: any) {
      if (error.status === 429) {
        showToast("warning", t("auth:sendToQuickly"));
        return;
      }
      if (error.message === "email_not_exists") {
        showToast("error", t("auth:emailNotExists"));
        return;
      }
      if (error.message === "user_verified") {
        showToast("info", t("auth:accountVerified"));
        return;
      }
      if (error.message === "email_sent_too_quickly") {
        showToast("warning", t("auth:sendToQuickly"));
        return;
      }
    }
  };

  const handleRegister = async () => {
    const recaptchaToken = await getRecaptchaToken(RECAPTCHA_ACTION.register);
    setIsLoading(true);
    setNotification(null);
    const { name, email, password } = getValues();

    if (userRegister) {
      try {
        const response = await userRegister(
          email,
          password,
          name,
          i18n.language,
          recaptchaToken,
        );
        setRegisterState({
          email: response,
        });
        showToast("success", t("auth:checkEmailVerify"));
      } catch (error: any) {
        if (error.message === "email_exists") {
          showToast("error", t("auth:emailExist"));
          setNotification(t("auth:emailExist"));
          return;
        }
        if (error.message === "user_not_verified") {
          showToast("info", t("auth:checkEmailVerify"));
          setNotification(t("auth:checkEmailVerify"));
          return;
        }
        showToast("error", t("auth:registerFail"));
        setNotification(t("auth:registerFail"));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderVerifyEmailHelpText = () => {
    return (
      <div className="container my-10 rounded-xl py-10 lg:my-16 lg:border">
        <div className="mx-auto w-max">
          <Logo className="w-full" />
        </div>
        <h2 className="mb-14 mt-4 flex items-center justify-center text-center text-2xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          {t("auth:verifyYourEmail")}
        </h2>
        <p className="mx-auto w-full text-center text-base text-neutral-700 dark:text-neutral-200 md:w-2/3 md:text-lg lg:w-2/3">
          {t("auth:weHaveSentEmail")}{" "}
          <span className="font-medium text-black">{registerState.email}</span>{" "}
          {t("auth:toVerifyYourEmail")}
        </p>
        <div className="mt-16 flex flex-row items-center justify-center space-x-4">
          <ButtonPrimary href={PATH_AUTH.login}>
            {t("common:auth.login")}
          </ButtonPrimary>
          <ButtonPrimary
            onClick={handleResendVerifyEmail}
            disabled={isActiveResend}
          >
            {t("auth:resendVerifyEmail")}
          </ButtonPrimary>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-Register  `}>
      {registerState.email ? (
        renderVerifyEmailHelpText()
      ) : (
        <div className="container mb-24 lg:mb-32">
          <h2 className="my-16 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
            {t("common:auth.register")}
          </h2>
          <div className="mx-auto max-w-md space-y-6 ">
            <div className="grid gap-3">
              {/*{loginSocials.map((item, index) => (*/}
              {/*  <a*/}
              {/*    key={index}*/}
              {/*    href={item.href}*/}
              {/*    className="nc-will-change-transform flex w-full rounded-lg bg-primary-50 px-4 py-3 transition-transform hover:translate-y-[-2px] dark:bg-neutral-800 sm:px-6"*/}
              {/*  >*/}
              {/*    <Image className="shrink-0" src={item.icon} alt={item.name} />*/}
              {/*    <h3 className="grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">*/}
              {/*      {item.name}*/}
              {/*    </h3>*/}
              {/*  </a>*/}
              {/*))}*/}
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) =>
                  handleGoogleLogin(credentialResponse?.credential ?? "")
                }
                onError={() => {
                  console.log("Login Failed");
                }}
              />
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
              onSubmit={handleSubmit(handleRegister)}
            >
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
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  {t("auth:name")}
                </span>
                <Input
                  placeholder="Joe"
                  className="mt-1"
                  onFocus={() => {
                    setNotification(null);
                  }}
                  {...register("name", { required: t("auth:nameRequired") })}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </label>
              <label className="block">
                <span className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
                  {t("auth:password")}
                </span>
                <Input
                  type="password"
                  className="mt-1"
                  {...register("password", {
                    required: t("auth:passwordRequired"),
                    minLength: {
                      value: 8,
                      message: t("auth:minLengthPassword"),
                    },
                  })}
                  onBlur={() => {
                    trigger("password");
                  }}
                  onFocus={() => {
                    setNotification(null);
                  }}
                />
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-400">
                  {t("auth:minLengthPassword")}
                </p>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </label>
              <label className="block">
                <span className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
                  {t("auth:confirmPassword")}
                </span>
                <Input
                  type="password"
                  className="mt-1"
                  {...register("confirmPassword", {
                    validate: (value) =>
                      value === getValues("password") ||
                      t("auth:passwordNotMatch"),
                  })}
                  onBlur={() => {
                    trigger("confirmPassword");
                  }}
                  onFocus={() => {
                    setNotification(null);
                  }}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </label>
              {notification && (
                <p className="text-center font-medium text-red-500">
                  {notification}
                </p>
              )}
              <ButtonPrimary loading={isLoading} type="submit">
                {t("common:auth.register")}
              </ButtonPrimary>
            </form>

            {/* ==== */}
            <span className="block text-center text-neutral-700 dark:text-neutral-300">
              {t("auth:alreadyAccount")} {` `}
              <Link href={PATH_AUTH.login} className="font-semibold underline">
                {t("auth:signIn")}
              </Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
