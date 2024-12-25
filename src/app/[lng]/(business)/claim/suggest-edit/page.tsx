"use client";

import * as React from "react";
import { useTranslation } from "@/app/i18n/client";
import { notFound, useSearchParams } from "next/navigation";
import { IBusiness } from "@/models/iBusiness";
import { getDetailBusiness } from "@/services/business";
import { useToast } from "@/hooks/useToast";
import FormSuggestEdit, {
  SuggestEditFormType,
} from "../components/FormSuggestEdit";
import { FormProvider, useForm } from "react-hook-form";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { PATH_PAGE } from "@/contains/paths";

const SuggestEdit = () => {
  const { t } = useTranslation(["claim", "common"]);
  const { showToast } = useToast();

  //
  const [businessData, setBusinessData] = React.useState<IBusiness | null>(
    null,
  );
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [displayAddress, setDisplayAddress] = React.useState("");

  //
  const searchParams = useSearchParams();
  const businessId = searchParams.get("bid");

  // fetch business data by id
  const getBusinessData = async (bid: string) => {
    setIsLoading(true);
    try {
      const response = await getDetailBusiness(bid);
      if (response) {
        setBusinessData(response);
      }
    } catch (error: any) {
      setError(t("common:businessNotFound"));
      showToast("error", t("common:businessNotFound"));
    } finally {
      setIsLoading(false);
    }
  };

  // refetch business data
  React.useEffect(() => {
    if (businessId) {
      getBusinessData(businessId);
    }
  }, [searchParams]);

  // show error
  if (error) {
    notFound();
  }

  const handleSubmitSucsess = () => {
    setIsSuccess(true);
  };

  const methods = useForm<SuggestEditFormType>({
    mode: "onChange",
    defaultValues: {
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
    },
  });

  React.useEffect(() => {
    setDisplayAddress(methods.getValues("displayedAddress"));
  }, [methods.watch("displayedAddress")]);

  const renderSuccessMessage = () => {
    return (
      <div className="my-16 lg:my-20">
        <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
          <CheckCircleIcon className="h-20 w-20 text-green-500" />
          <h3 className="text-xl font-semibold lg:text-2xl">
            {t("claim:suggestEdit")}
          </h3>
          <p className="mx-auto w-full text-center text-base text-neutral-700 dark:text-neutral-200 md:w-2/3 md:text-lg lg:w-2/3">
            {t("claim:submitSuggestSuccess")}
          </p>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center space-y-4">
          <ButtonPrimary href={PATH_PAGE.root}>
            {t("common:home")}
          </ButtonPrimary>
        </div>
      </div>
    );
  };

  if (isSuccess) {
    return renderSuccessMessage();
  }

  return (
    <FormProvider {...methods}>
      <div className="my-12 flex flex-row items-start gap-20 lg:my-16">
        <div className="content flex-1 space-y-8">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold">{t("claim:suggestEdit")}</h1>
            <p>{t("claim:suggestMustVerified")}</p>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          </div>

          <FormSuggestEdit
            businessData={businessData}
            onSubmitSuccess={handleSubmitSucsess}
          />
        </div>
        <div className="relative hidden aspect-1 lg:block lg:w-[430px]">
          {isLoading ? (
            <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-500"></div>
          ) : (
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed?origin=mfe&pb=!1m4!2m1!1s${displayAddress || (businessData?.location?.lat && businessData?.location?.lon ? `${businessData?.location?.lat},${businessData?.location?.lon}` : businessData?.address.displayed)}!4f15!5e0!6i10`}
            ></iframe>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default SuggestEdit;
