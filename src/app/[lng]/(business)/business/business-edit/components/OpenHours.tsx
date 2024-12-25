"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import _ from "lodash";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { UpdateBusiness } from "@/services/business";
import { APP_CONFIGS } from "@/config-global";
import { useBusinessDetail } from "@/contexts/businessDetailContext";
import UpdateOpenHours from "@/components/UpdateOpenHours";
import { useRouter } from "next/navigation";
import { PATH_BUSINESS_DASHBOARD, PATH_PAGE } from "@/contains/paths";
import { useToast } from "@/hooks/useToast";
import { UN_UPDATE_FIELD } from "@/contains/unUpdateField";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const OpenHours = () => {
  const { showToast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();
  const { detailData, refetch } = useBusinessDetail();
  const { t } = useTranslation(["common", "account"]);
  const { getValues } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!detailData?.id) {
    return <></>;
  }

  const onSubmit = async (data: any) => {
    // clear some field cant update in data update object
    const clearFormData = _.omit(data, UN_UPDATE_FIELD);
    const recaptchaToken = await getRecaptchaToken();
    setIsLoading(true);
    try {
      await UpdateBusiness(detailData.id, clearFormData, recaptchaToken);
      await refetch();
      showToast("success", t("account:successUpdate"));
      localStorage.removeItem(APP_CONFIGS.catsbusinessValue);
    } catch (error) {
      showToast(
        "error",
        <a
          href={PATH_PAGE.contact}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >{`${t("account:failUpdate")}`}</a>,
        5000,
      ); // delay 5s
    } finally {
      setIsLoading(false);
      router.push(PATH_BUSINESS_DASHBOARD.editBusiness(detailData.slug));
    }
  };

  return (
    <>
      {/* form content */}
      <div className="my-4 space-y-4">
        <UpdateOpenHours />
      </div>

      <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* control submit */}
      <div className="mt-3 flex flex-row justify-end gap-3">
        <ButtonPrimary
          loading={isLoading}
          onClick={() => onSubmit(getValues())}
          className="!py-2"
        >
          {t("common:saveUpdate")}
        </ButtonPrimary>
      </div>
    </>
  );
};

export default OpenHours;
