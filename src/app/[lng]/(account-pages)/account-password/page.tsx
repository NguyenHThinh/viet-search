"use client";

import React, { useState } from "react";
import Label from "@/components/Label";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import { useTranslation } from "@/app/i18n/client";
import { useToast } from "@/hooks/useToast";
import { useForm } from "react-hook-form";
import { ResetPasswordData } from "../../(auth)/auth/reset-password/page";
import { resetPasswordWithToken } from "@/services/auth";
import { APP_CONFIGS } from "@/config-global";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { RECAPTCHA_ACTION } from "@/constants";

const AccountPass = () => {
  const { t } = useTranslation(["account", "auth"]);
  const { showToast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const {
    trigger,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordData>();

  const handleSendResetPasswordEmail = async () => {
    const recaptchaToken = await getRecaptchaToken(RECAPTCHA_ACTION.forgotPass);
    setIsLoading(true);
    setNotification(null);
    const { password } = getValues();
    const token = localStorage.getItem(APP_CONFIGS.keyToken) || "";
    try {
      await resetPasswordWithToken(token, password, recaptchaToken);
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
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-2xl font-semibold">
        {t("account:changeYourPassword")}
      </h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <form onSubmit={handleSubmit(handleSendResetPasswordEmail)}>
        <div className=" max-w-xl space-y-6">
          <div>
            <Label>{t("account:newPassword")}</Label>
            <Input
              type="password"
              className="mt-1.5"
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
          </div>
          <div>
            <Label>{t("account:confirmPassword")}</Label>
            <Input
              type="password"
              className="mt-1.5"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === getValues("password") || t("auth:passwordNotMatch"),
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
          </div>
          {notification && (
            <p className="text-center font-medium text-red-500">
              {notification}
            </p>
          )}
          <div className="pt-2">
            <ButtonPrimary loading={isLoading}>
              {t("account:changePassword")}
            </ButtonPrimary>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountPass;
