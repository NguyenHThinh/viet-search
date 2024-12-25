"use client";

import { useTranslation } from "@/app/i18n/client";
import { useBusinessDetail } from "@/contexts/businessDetailContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { fullFormSchema } from "@/app/[lng]/(business)/add-business/form-config";
import OpenHours from "../../components/OpenHours";

const EditBusinesspage = () => {
  const { detailData } = useBusinessDetail();
  const { t, i18n } = useTranslation(["addBusiness"]);
  //
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(fullFormSchema(t)),
    defaultValues: {
      ...detailData,
      // refactor some field
      categories: detailData?.categories.map((item) => item?.id) ?? [],
      address: {
        displayed: detailData?.address?.displayed ?? "",
        zipcode: detailData?.address?.zipcode ?? "",
        country: detailData?.address?.country ?? "",
        state: detailData?.address?.state ?? "",
        street: detailData?.address?.street ?? "",
      },
      // update field
      open_hours: detailData?.open_hours ?? {
        dayOfWeek: {
          mon: [{ from: 0, to: 0 }],
          wed: [{ from: 0, to: 0 }],
          tue: [{ from: 0, to: 0 }],
          thu: [{ from: 0, to: 0 }],
          fri: [{ from: 0, to: 0 }],
          sat: [{ from: 0, to: 0 }],
          sun: [{ from: 0, to: 0 }],
        },
        type: "mainHours",
        note: "",
        publicHoliday: "",
      },
    },
  });

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">
          {t("addBusiness:stepTitle.openTime")}
        </h2>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      {/* ---- main content ---- */}
      <div className="w-full space-y-8">
        <FormProvider {...methods}>
          {detailData?.id && <OpenHours />}
        </FormProvider>
      </div>
    </>
  );
};

export default EditBusinesspage;
