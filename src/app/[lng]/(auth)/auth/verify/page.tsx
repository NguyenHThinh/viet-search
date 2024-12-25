"use client";

import React, { FormEvent, useEffect, useState } from "react";

import ButtonPrimary from "@/shared/ButtonPrimary";
// auth
import { PATH_AUTH } from "@/contains/paths";
import { useTranslation } from "@/app/i18n/client";
import Logo from "@/shared/Logo";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { sendVerifyEmail, verifyEmail } from "@/services/auth";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { RECAPTCHA_ACTION } from "@/constants";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";
import Input from "@/shared/Input";

const Verify = () => {
  const { t, i18n } = useTranslation(["common", "auth"]);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { getRecaptchaToken } = useRecaptcha();
  const [isShowResendForm, setIsShowResendForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // get token params
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  //
  const handleVerifyEmail = async (token: string) => {
    try {
      await verifyEmail(token);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerifyEmail = async (e: FormEvent) => {
    const recaptchaToken = await getRecaptchaToken(
      RECAPTCHA_ACTION.verifyAccountEmail,
    );
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendVerifyEmail(email, i18n.language, recaptchaToken);
      showToast("success", t("auth:verifySuccess"));
    } catch (error: any) {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }

    handleVerifyEmail(token);
  }, [token]);

  const renderStateVerify = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center text-blue-500">
          <svg
            className="-ml-1 mr-3 h-16 w-16 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      );
    }
    if (isSuccess) {
      return (
        <>
          <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
            <CheckCircleIcon className="h-20 w-20 text-green-500" />
            <h3 className="text-xl font-semibold lg:text-2xl">
              {t("auth:verifySuccess")}
            </h3>
            <p className="mx-auto w-full text-center text-base text-neutral-700 dark:text-neutral-200 md:w-2/3 md:text-lg lg:w-2/3">
              {t("auth:verifiedAccountSuccess")}
            </p>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center space-y-4">
            <ButtonPrimary href={PATH_AUTH.login}>
              {t("common:auth.login")}
            </ButtonPrimary>
          </div>
        </>
      );
    }

    if (!isSuccess) {
      return (
        <>
          <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
            <XCircleIcon className="h-20 w-20 text-red-500" />
            <h3 className="text-xl font-semibold lg:text-2xl">
              {t("auth:verifyFailed")}
            </h3>
            <p className="mx-auto w-full text-center text-base text-neutral-700 dark:text-neutral-200 md:w-2/3 md:text-lg lg:w-2/3">
              {t("auth:emailCouldntVerify")}
            </p>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center space-y-4">
            <ButtonPrimary onClick={() => setIsShowResendForm(true)}>
              {t("auth:resendVerifyEmail")}
            </ButtonPrimary>
          </div>
        </>
      );
    }
  };

  const renderResendForm = () => {
    return (
      <>
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          {t("auth:sendVerifyEmail")}
        </h2>
        <div className="mx-auto max-w-md space-y-6">
          <form
            className="grid grid-cols-1 gap-6"
            onSubmit={handleSendVerifyEmail}
          >
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                {t("auth:emailAddress")}
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <ButtonPrimary loading={isLoading} type="submit">
              {t("auth:send")}
            </ButtonPrimary>
          </form>
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            {t("auth:alreadyAccount")} {` `}
            <Link href={PATH_AUTH.login} className="font-semibold underline">
              {t("auth:signIn")}
            </Link>
          </span>
        </div>
      </>
    );
  };

  return (
    <div className="nc-Verify">
      <div className="container my-10 min-h-screen rounded-xl py-10">
        <div className="mx-auto w-max">
          <Logo className="w-full" />
        </div>
        {isShowResendForm ? (
          renderResendForm()
        ) : (
          <>
            <h2 className="mb-14 mt-4 flex items-center justify-center text-center text-2xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
              {t("auth:verifyYourEmail")}
            </h2>
            {renderStateVerify()}
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
