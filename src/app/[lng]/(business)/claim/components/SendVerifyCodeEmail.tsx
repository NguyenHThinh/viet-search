"use client";

import { useTranslation } from "@/app/i18n/client";
import { PATH_CLAIM } from "@/contains/paths";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useToast } from "@/hooks/useToast";
import { IBusiness, IBusinessContact } from "@/models/iBusiness";
import { claimWithEmail } from "@/services/claimBusiness";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trans } from "react-i18next";

const SendVerifyEmail = ({
  businessData,
  bid,
}: {
  businessData: IBusiness | null;
  bid: string;
}) => {
  const { getRecaptchaToken } = useRecaptcha();
  const { t } = useTranslation(["claim", "auth"]);
  const { showToast } = useToast();
  const router = useRouter();

  const [emailContacts, setEmailContacts] = useState<IBusinessContact[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const emails = businessData?.contacts?.filter(
      (contact) => contact.type === "email",
    );

    setEmailContacts(emails || []);
    setSelectedEmail(emails?.[0]?.value || "");
  }, [businessData]);

  const handleSendClaimEmail = async () => {
    const recaptchaToken = await getRecaptchaToken();
    setIsLoading(true);
    setError("");

    try {
      await claimWithEmail(bid, selectedEmail, recaptchaToken);
      showToast("success", t("claim:submitSuccess"));
      router.push(PATH_CLAIM.verifyCode(bid, selectedEmail));
    } catch (error: any) {
      if (error.message === "already requested") {
        setError(t("auth:sendToQuickly"));
        showToast("error", t("auth:sendToQuickly"));
        return;
      }
      setError("send failed");
      showToast("error", "send failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cursor-default space-y-3">
      {emailContacts.length > 1 ? (
        <select
          onChange={(e) => {
            setSelectedEmail(e.target.value);
          }}
          className="block h-11 w-full rounded-2xl border-neutral-200 bg-white text-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25"
        >
          {emailContacts.map((email, index) => (
            <option value={email.value} key={index}>
              {email.value}
            </option>
          ))}
        </select>
      ) : (
        <p>
          <Trans
            i18nKey="claim:weWillSentEmailto"
            values={{ email: selectedEmail }}
          >
            <span className="whitespace-nowrap font-bold" />
          </Trans>
        </p>
      )}
      {emailContacts.length > 1 && (
        <p>
          <Trans
            i18nKey="claim:weWillSentEmailto"
            values={{ email: selectedEmail }}
          >
            <span className="whitespace-nowrap font-bold" />
          </Trans>
        </p>
      )}
      {error && <p className="ml-1 mt-1 text-red-500">{error}</p>}
      <ButtonPrimary loading={isLoading} onClick={handleSendClaimEmail}>
        {t("auth:send")}
      </ButtonPrimary>
    </div>
  );
};

export default SendVerifyEmail;
