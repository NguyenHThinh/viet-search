"use client";

import { useTranslation } from "@/app/i18n/client";
import { useBusinessDetail } from "@/contexts/businessDetailContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { fullFormSchema } from "../../../add-business/form-config";
import FormEdit from "../components/FormEdit";
import OpenHours from "../components/OpenHours";
import ShowOpenHours from "@/components/ShowOpenHours";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { PATH_BUSINESS_DASHBOARD } from "@/contains/paths";
import Link from "next/link";
import ProgressTasks, { ProfileField } from "@/components/common/ProgressTasks";

const EditBusinesspage = () => {
  const { detailData } = useBusinessDetail();
  const { t, i18n } = useTranslation([
    "common",
    "detail",
    "addBusiness",
    "dashBoard",
  ]);
  //
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(fullFormSchema(t)),
    defaultValues: {
      name: detailData?.name ?? "",
      types: detailData?.types ?? ["company"],
      description:
        detailData?.description ??
        detailData?.descriptions?.[i18n.language] ??
        "",
      descriptions: detailData?.descriptions ?? {},
      keywords: detailData?.keywords ?? [],
      categories: detailData?.categories.map((item) => item?.id) ?? [],
      contacts: detailData?.contacts ?? [{ type: "website", value: "" }],
      address: {
        displayed: detailData?.address?.displayed ?? "",
        zipcode: detailData?.address?.zipcode ?? "",
        country: detailData?.address?.country ?? "",
        state: detailData?.address?.state ?? "",
        street: detailData?.address?.street ?? "",
      },
    },
  });

  const PROGRESS_FIELD: ProfileField[] = [
    {
      key: 1,
      label: t("addBusiness:logo"),
      value: !!detailData?.thumbnail,
      weight: 10,
    },
    {
      key: 2,
      label: t("addBusiness:description"),
      value: !!detailData?.description,
      weight: 10,
    },
    {
      key: 3,
      label: t("addBusiness:keyWords"),
      value: !!detailData?.keywords?.length,
      weight: 10,
    },
    {
      key: 4,
      label: t("addBusiness:categories"),
      value: !!detailData?.categories?.length,
      weight: 10,
    },
    {
      key: 5,
      label: t("common:contacts"),
      value: !!detailData?.contacts?.length,
      weight: 10,
    },
    {
      key: 6,
      label: t("addBusiness:photos"),
      value: !!detailData?.images?.length,
      weight: 10,
    },
    {
      key: 7,
      label: t("addBusiness:stepTitle.openTime"),
      value: detailData?.open_hours?.type === "mainHours",
      weight: 10,
    },
    {
      key: 8,
      label: t("addBusiness:step2.fullAddress"),
      value: !!detailData?.address?.displayed,
      weight: 10,
    },
    {
      key: 9,
      label: t("addBusiness:name"),
      value: !!detailData?.name,
      weight: 10,
    },
  ];

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">
          {t("addBusiness:businessInfo")}
        </h2>
      </div>

      <ProgressTasks profileFields={PROGRESS_FIELD} />

      <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>

      {/* ---- main content ---- */}
      <div className="w-full space-y-8">
        <FormProvider {...methods}>
          {detailData?.id && <FormEdit />}
          {detailData?.id && (
            <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
          )}
          {detailData?.id && (
            <div className="">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {t("addBusiness:stepTitle.openTime")}
                </h3>
                <Link
                  href={PATH_BUSINESS_DASHBOARD.openHoursBusiness(
                    detailData.slug,
                  )}
                  className="flex gap-2 rounded-xl border px-3 py-1.5 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-600"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  {t("common:edit")}
                </Link>
              </div>
              <ShowOpenHours openHours={detailData.open_hours} />
            </div>
          )}
        </FormProvider>
      </div>
    </>
  );
};

export default EditBusinesspage;
