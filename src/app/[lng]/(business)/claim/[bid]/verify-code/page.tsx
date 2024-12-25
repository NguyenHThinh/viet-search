"use client";

import React, { useRef, useState } from "react";

// auth
import { useTranslation } from "@/app/i18n/client";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { PATH_BUSINESS_DASHBOARD } from "@/contains/paths";
import { useToast } from "@/hooks/useToast";
import { useSearchParams } from "next/navigation";
import {
  resendVerifyClaimCode,
  verifyClaimCode,
} from "@/services/claimBusiness";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const Verify = ({ params: { bid } }: { params: { bid: string } }) => {
  const { getRecaptchaToken } = useRecaptcha();
  const { t, i18n } = useTranslation(["common", "auth", "claim", "footer"]);
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const businessEmail = searchParams.get("email") ?? "";

  //
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [codeValues, setcodeValues] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);

  //
  const handleResendOtp = async (email: string) => {
    const recaptchaToken = await getRecaptchaToken();
    if (!email) {
      showToast("error", t("common:emailNotFound"));
      return;
    }
    try {
      await resendVerifyClaimCode(bid, email, i18n.language, recaptchaToken);
      showToast("success", t("common:resendSuccess"));
    } catch (error: any) {
      if (error.message === "Claim not found") {
        showToast("error", t("common:requestNotFound"));
      }
      if (error.message === "OTP sent before") {
        showToast("error", t("common:checkYourEmail"));
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newValue = e.target.value;
    const newcodeValues = [...codeValues];
    newcodeValues[index] = newValue;
    if (/^\d$/.test(newValue)) {
      setcodeValues(newcodeValues);
      // check set all code otp
      const allFilled = newcodeValues.every((value) => value !== "");
      setIsDisabled(!allFilled);
      if (index < 3) {
        inputsRef.current[index + 1]?.focus(); // autofocus next input
      }
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      const newcodeValues = [...codeValues];
      newcodeValues[index] = "";
      setcodeValues(newcodeValues);

      if (index > 0 && codeValues[index] === "") {
        inputsRef.current[index - 1]?.focus();
      }

      setIsDisabled(true);
    }
  };

  //
  const handleSendVerifyEmail = async () => {
    const recaptchaToken = await getRecaptchaToken();
    setNotification(null);
    setIsLoading(true);
    try {
      await verifyClaimCode(
        bid,
        businessEmail,
        codeValues.join(""),
        recaptchaToken,
      );
      showToast("success", t("auth:verifySuccess"));
      setIsSuccess(true);
    } catch (error: any) {
      if (error.message === "Invalid OTP") {
        showToast("error", t("common:otpInvalid"));
        setNotification(t("common:otpInvalid"));
        return;
      }
      if (error.message === "OTP expired") {
        showToast("error", t("common:optExpired"));
        setNotification(t("common:optExpired"));
        return;
      }
      if (error.message === "Claim not found") {
        showToast("info", t("common:requestNotFound"));
        setNotification(t("common:requestNotFound"));
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuccessMessage = () => {
    return (
      <>
        <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
          <CheckCircleIcon className="h-20 w-20 text-green-500" />
          <h3 className="text-xl font-semibold lg:text-2xl">
            {t("claim:claimSuccessful")}
          </h3>
          <div className="space-y-2 text-left">
            <p className="mx-auto w-full text-lg font-medium">
              {t("claim:nowYouCan")}
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>{t("claim:manageYourBusiness")}</li>
              <li>{t("claim:viewBusinessStatistics")}</li>
              <li>{t("claim:receiveAndRespondMessage")}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-row items-center justify-center space-x-4">
          <ButtonPrimary href={PATH_BUSINESS_DASHBOARD.editBusiness(bid)}>
            {t("footer:businessDashboard")}
          </ButtonPrimary>
          <ButtonPrimary href={PATH_BUSINESS_DASHBOARD.createdBusiness}>
            {t("claim:listBusiness")}
          </ButtonPrimary>
        </div>
      </>
    );
  };

  return (
    <div className="nc-Login min-h-screen">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          {t("claim:verifyClaimBusiness")}
        </h2>
        {isSuccess ? (
          renderSuccessMessage()
        ) : (
          <div className="mx-auto max-w-md space-y-6">
            <p className="text-center text-lg">{t("common:weHaveSentOTP")}</p>
            <form
              className="grid grid-cols-1 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendVerifyEmail();
              }}
            >
              <div className="mx-auto flex w-2/3 justify-between">
                {codeValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    onFocus={() => {
                      setNotification(null);
                    }}
                    ref={(el) => (inputsRef.current[index] = el)}
                    className="h-12 w-12 rounded-md border text-center text-2xl"
                  />
                ))}
              </div>
              {notification && (
                <p className="text-center font-medium text-red-500">
                  {notification}
                </p>
              )}
              <ButtonPrimary
                disabled={isDisabled}
                loading={isLoading}
                // onClick={handleSendVerifyEmail}
              >
                {t("auth:send")}
              </ButtonPrimary>
            </form>
            <span className="block text-center">
              {t("common:notReceivedOTP")} {` `}
              <button
                onClick={() => handleResendOtp(businessEmail || "")}
                className="font-medium underline hover:no-underline"
              >
                {t("common:resend")}
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
