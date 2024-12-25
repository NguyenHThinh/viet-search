"use client";

import { useTranslation } from "@/app/i18n/client";
import { Controller, useFormContext } from "react-hook-form";
import { IBusiness } from "@/models/iBusiness";
import { FC, useEffect, useState } from "react";
import Input from "@/shared/Input";
import UpdateOpenHours from "@/components/UpdateOpenHours";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { useToast } from "@/hooks/useToast";
import { customerSuggestEdit } from "@/services/claimBusiness";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import AddContact from "../../add-business/components/AddContact";

export interface SuggestEditFormType {
  displayedAddress: string;
  contacts: { type: string; value: string }[];
  open_hours: {
    dayOfWeek: {
      mon: { from: number; to: number }[];
      tue: { from: number; to: number }[];
      wed: { from: number; to: number }[];
      thu: { from: number; to: number }[];
      fri: { from: number; to: number }[];
      sat: { from: number; to: number }[];
      sun: { from: number; to: number }[];
    };
    type: string;
    note: string;
    publicHoliday: string;
  };
}

export interface FormSuggestEditProps {
  businessData: IBusiness | null;
  onSubmitSuccess?: () => void;
}

const FormSuggestEdit: FC<FormSuggestEditProps> = ({
  businessData,
  onSubmitSuccess,
}) => {
  const { t } = useTranslation(["addBusiness", "claim"]);
  const { showToast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    getValues,
  } = useFormContext<SuggestEditFormType>();

  const [isLoading, setIsLoading] = useState(false);

  //
  useEffect(() => {
    reset({
      contacts: businessData?.contacts ?? [{ type: "website", value: "" }],
      displayedAddress: businessData?.address?.displayed ?? "",
      open_hours: businessData?.open_hours ?? {
        dayOfWeek: businessData?.open_hours?.dayOfWeek || {
          mon: [{ from: 0, to: 0 }],
          wed: [{ from: 0, to: 0 }],
          tue: [{ from: 0, to: 0 }],
          thu: [{ from: 0, to: 0 }],
          fri: [{ from: 0, to: 0 }],
          sat: [{ from: 0, to: 0 }],
          sun: [{ from: 0, to: 0 }],
        },
        type: businessData?.open_hours?.type || "",
        note: businessData?.open_hours?.note || "",
        publicHoliday: businessData?.open_hours?.publicHoliday || "",
      },
    });
  }, [businessData]);

  const onSubmit = async (data: SuggestEditFormType) => {
    if (!businessData?.id) {
      console.error("Error submitting form");
      showToast("error", t("claim:submitFail"));
      return;
    }

    const recaptchaToken = await getRecaptchaToken();
    setIsLoading(true);
    try {
      await customerSuggestEdit(businessData.id, data, recaptchaToken);
      showToast("success", t("claim:submitSuccess"));
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      console.error("Error submitting form: ", error);
      showToast("error", t("claim:submitFail"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderAddressInput = () => {
    return (
      <Controller
        name="displayedAddress"
        control={control}
        defaultValue={getValues("displayedAddress") || ""}
        render={({ field }) => (
          <>
            <Input
              {...field}
              value={field.value}
              placeholder={t("addBusiness:step2.exampleAddress")}
              onFocus={() => {
                clearErrors("displayedAddress");
              }}
              onChange={(e) => {
                field.onChange(e);
              }}
            />
            {errors.displayedAddress && (
              <p className="ml-1 mt-1 text-sm text-red-500">
                {String(errors.displayedAddress.message) ||
                  t("addBusiness:error.missingField")}
              </p>
            )}
          </>
        )}
      />
    );
  };

  return (
    <div className="w-full space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="space-y-3">
          <p className="text-lg font-semibold">
            {t("addBusiness:step2.fullAddress")}
          </p>
          {renderAddressInput()}
        </div>
        <div className="relative block aspect-1 w-[430px] lg:hidden">
          {isLoading ? (
            <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-500"></div>
          ) : (
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed?origin=mfe&pb=!1m4!2m1!1s${getValues("displayedAddress") || (businessData?.location?.lat && businessData?.location?.lon ? `${businessData?.location?.lat},${businessData?.location?.lon}` : businessData?.address.displayed)}!4f15!5e0!6i10`}
            ></iframe>
          )}
        </div>
        <div className="space-y-3">
          <p className="text-lg font-semibold">
            {t("addBusiness:stepTitle.contacts")}
          </p>
          <AddContact hasLabel={false} />
        </div>
        <div className="max-w-[430px] space-y-3">
          <p className="text-lg font-semibold">
            {t("addBusiness:stepTitle.openTime")}
          </p>
          <UpdateOpenHours businessData={businessData} />
        </div>
        <ButtonPrimary
          loading={isLoading}
          type="submit"
          className="!px-6 !py-3 text-lg"
        >
          {t("claim:submit")}
        </ButtonPrimary>
      </form>
    </div>
  );
};

export default FormSuggestEdit;
