"use client";

import React, { useState } from "react";

// auth
import { useTranslation } from "@/app/i18n/client";
import { resetPasswordWithToken } from "@/services/auth";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { PATH_AUTH } from "@/contains/paths";
import { useToast } from "@/hooks/useToast";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { RECAPTCHA_ACTION } from "@/constants";
import { useRecaptcha } from "@/hooks/useRecaptcha";

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const { t } = useTranslation(["common", "auth"]);
  const { getRecaptchaToken } = useRecaptcha();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();

  // get token params
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    trigger,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordData>();

  //
  const { showToast } = useToast();

  //
  const handleSendResetPasswordEmail = async () => {
    const recaptchaToken = await getRecaptchaToken(RECAPTCHA_ACTION.forgotPass);
    setIsLoading(true);
    setNotification(null);
    const { password } = getValues();
    try {
      await resetPasswordWithToken(token, password, recaptchaToken);
      router.push(PATH_AUTH.login);
      showToast("success", t("auth:resetPasswordSuccess"));
    } catch (error: any) {
      if (error.message === "invalid_token") {
        showToast("error", t("auth:invalidToken"));
        setNotification(t("auth:invalidToken"));
        return;
      }
      if (error.message === "invalid_email") {
        showToast("error", t("auth:emailNotExists"));
        setNotification(t("auth:emailNotExists"));
        return;
      }
      showToast("error", t("auth:failedAction"));
      setNotification(t("auth:failedAction"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nc-Login">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          {t("auth:resetPassword")}
        </h2>
        <div className="mx-auto max-w-md space-y-6">
          <form
            className="grid grid-cols-1 gap-6"
            onSubmit={handleSubmit(handleSendResetPasswordEmail)}
          >
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
              {t("auth:reset")}
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
    </div>
  );
};

export default ResetPassword;
