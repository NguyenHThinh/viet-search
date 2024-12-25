"use client";

import React, { MouseEvent, useEffect, useState } from "react";
import PageAddBusiness1 from "./FormStep/PageAddBusiness1";
import PageAddBusiness2 from "./FormStep/PageAddBusiness2";
import PageAddBusiness3 from "./FormStep/PageAddBusiness3";
import Steper from "./components/Steper";
import { getStepSchemas, iFormSchema } from "./form-config";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createBusiness } from "@/services/business";
import { useTranslation } from "@/app/i18n/client";
import { APP_CONFIGS } from "@/config-global";
import Link from "next/link";
import { PATH_BUSINESS_DASHBOARD, PATH_PAGE } from "@/contains/paths";
import { useRouter, useSearchParams } from "next/navigation";
import clearFormData from "@/utils/clearFormData";
import PageAddBusiness4 from "./FormStep/PageAddBusiness4";
import { useToast } from "@/hooks/useToast";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const Page = () => {
  const { showToast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();
  const { t } = useTranslation(["addBusiness", "common"]);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const businessName = searchParams.get("bname"); // business name

  const stepSchema = getStepSchemas(t);

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(
      stepSchema[currentStep - 1].schema as Yup.ObjectSchema<iFormSchema>,
    ),
    defaultValues: {
      name: businessName ?? "",
      types: ["company"], // this text is value of select option in step 1 you want set default
      description: "",
      descriptions: {},
      keywords: [],
      categories: [],
      contacts: [{ type: "website", value: "" }], // default show 1 contact input
      address: { displayed: "", zipcode: "", country: "" },
      images: [],
      thumbnail: "",
      open_hours: {
        dayOfWeek: {
          mon: [{ from: 32400000, to: 64800000 }],
          tue: [{ from: 32400000, to: 64800000 }],
          wed: [{ from: 32400000, to: 64800000 }],
          thu: [{ from: 32400000, to: 64800000 }],
          fri: [{ from: 32400000, to: 64800000 }],
          sat: [{ from: 32400000, to: 64800000 }],
          sun: [{ from: 32400000, to: 64800000 }],
        },
        type: "mainHours",
        note: "",
        publicHoliday: "",
      },
    },
  });

  // clear cats value when add business page unmount
  useEffect(() => {
    const handleClearCatsStorage = () => {
      localStorage.removeItem(APP_CONFIGS.catsbusinessValue);
    };

    window.addEventListener("beforeunload", handleClearCatsStorage);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleClearCatsStorage);
    };
  }, []);

  // handle submit form
  const onSubmit = async (data: any) => {
    const recaptchaToken = await getRecaptchaToken();
    setIsLoading(true);
    try {
      const response = await createBusiness(data, recaptchaToken);
      router.push(PATH_BUSINESS_DASHBOARD.editBusiness(response.slug));
      localStorage.removeItem(APP_CONFIGS.catsbusinessValue);
      showToast("success", t("addBusiness:successfulAdd"));
    } catch (error) {
      setNotification(t("addBusiness:failAdd"));
      showToast(
        "error",
        <a
          href={PATH_PAGE.contact}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {t("addBusiness:failAdd")}
        </a>,
        5000,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isValid = await methods.trigger();
    if (isValid) {
      if (currentStep < stepSchema.length) {
        setCurrentStep(currentStep + 1);
        return;
      }
      const formDataSubmit = clearFormData(methods.getValues());
      onSubmit(formDataSubmit);
      // console.log(formDataSubmit);
    } else {
      showToast("error", t("addBusiness:error.missingField"));
    }
  };

  const handBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentStep(currentStep - 1);
  };

  // reset screen when change step
  useEffect(() => {
    window.scrollTo(0, 50);
  }, [currentStep]);

  //
  let ContentComponent = PageAddBusiness1;
  switch (currentStep) {
    case 1:
      ContentComponent = PageAddBusiness1;
      break;
    case 2:
      ContentComponent = PageAddBusiness2;
      break;
    case 3:
      ContentComponent = PageAddBusiness3;
      break;
    case 4:
      ContentComponent = PageAddBusiness4;
      break;

    default:
      ContentComponent = PageAddBusiness1;
      break;
  }

  return (
    <FormProvider {...methods}>
      {/* header step infomation */}
      <Steper currentStep={currentStep} t={t} />

      {/* form content */}
      {/* <div className="listingSection__wrap "> */}
      <form className="listingSection__wrap ">
        <ContentComponent />
      </form>
      {/* </div> */}

      {/* -control change step */}
      <div className="flex justify-end space-x-5">
        {currentStep > 1 && (
          <button
            onClick={handBack}
            className="rounded-full bg-neutral-50 px-4 py-2 text-neutral-700 shadow hover:bg-neutral-100"
          >
            {t("addBusiness:goBack")}
          </button>
        )}
        <button
          onClick={handleNext}
          className="rounded-full bg-[#2CA6D1] px-4 py-2 text-white shadow hover:bg-[#57B8DB]"
        >
          {currentStep === stepSchema.length
            ? t("addBusiness:submit")
            : t("common:continue")}
        </button>
      </div>

      {/* Loading  */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
        </div>
      )}

      {/* Notification Popup */}
      {notification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70">
          <div className="w-full max-w-xs rounded bg-white p-4 shadow-lg dark:bg-gray-800 dark:text-white">
            <p className="text-lg font-semibold">{notification}</p>
            <div className="flex justify-end">
              <Link
                href={PATH_PAGE.contact}
                onClick={() => setNotification(null)}
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {t("common:support")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </FormProvider>
  );
};

export default Page;
