"use client";

import React, { FormEvent, useState } from "react";

// auth
import { useTranslation } from "@/app/i18n/client";
import { sendResetPasswordEmail } from "@/services/auth";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { PATH_AUTH } from "@/contains/paths";
import { useToast } from "@/hooks/useToast";
import Logo from "@/shared/Logo";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { RECAPTCHA_ACTION } from "@/constants";

const ForgotPassword = () => {
  const { t, i18n } = useTranslation(["common", "auth"]);
  const { getRecaptchaToken } = useRecaptcha();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);

  //
  const { showToast } = useToast();

  //
  const handleSendResetPasswordEmail = async (e: FormEvent) => {
    const recaptchaToken = await getRecaptchaToken(
      RECAPTCHA_ACTION.resetPassEmail,
    );
    setNotification(null);
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendResetPasswordEmail(email, i18n.language, recaptchaToken);
      showToast("success", t("auth:sendEmailSuccess"));
      setIsSubmit(true);
    } catch (error: any) {
      if (error.message === "email_not_exists") {
        showToast("error", t("auth:emailNotExists"));
        setNotification(t("auth:emailNotExists"));
        return;
      }
      if (error.message === "email_sent_too_quickly") {
        showToast("warning", t("auth:sendToQuickly"));
        setNotification(t("auth:sendToQuickly"));
        return;
      }
      showToast("error", t("auth:failedAction"));
      setNotification(t("auth:failedAction"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderVerifyEmailHelpText = () => {
    return (
      <div className="container my-10 rounded-xl py-10 lg:my-16 lg:border">
        <div className="mx-auto w-max">
          <Logo className="w-full" />
        </div>
        <h2 className="mb-14 mt-4 flex items-center justify-center text-center text-2xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          {t("auth:resetPassword")}
        </h2>
        <p className="mx-auto w-full text-center text-base text-neutral-700 dark:text-neutral-200 md:w-2/3 md:text-lg lg:w-2/3">
          {t("auth:weHaveSentEmail")}{" "}
          <span className="font-medium text-black">{email}</span>{" "}
          {t("auth:toResetYourPassword")}
        </p>
        <div className="mt-16 flex flex-col items-center justify-center space-y-4">
          <ButtonPrimary href={PATH_AUTH.login}>
            {t("common:auth.login")}
          </ButtonPrimary>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-ForgotPassword">
      {isSubmit ? (
        renderVerifyEmailHelpText()
      ) : (
        <div className="container mb-24 lg:mb-32">
          <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
            {t("auth:sendForgotPassword")}
          </h2>
          <div className="mx-auto max-w-md space-y-6">
            <form
              className="grid grid-cols-1 gap-6"
              onSubmit={handleSendResetPasswordEmail}
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
              {notification && (
                <p className="text-center font-medium text-red-500">
                  {notification}
                </p>
              )}
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
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
