"use client";

import { useTranslation } from "@/app/i18n/client";
import AvatarUploadCrop from "@/components/uploadImages/AvatarUploadCrop";
import RHFUploadImage from "@/components/uploadImages/RHFUploadImage";
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";

export interface PageAddBusiness4Props {}

const PageAddBusiness4: FC<PageAddBusiness4Props> = () => {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation(["addBusiness"]);

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">{t("step3.businessPicture")}</h2>
        <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
          {t("addBusiness:step3.helperPicture")}
        </span>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        <div>
          <span className="text-lg font-semibold">
            {t("addBusiness:step3.coverImage")}
          </span>
          <div className="mt-5 ">
            {/* <RHFUploadImage name="thumbnail" /> */}
            <AvatarUploadCrop
              avatar={getValues("thumbnail")}
              onImageChange={(url) => setValue("thumbnail", url)}
            />
          </div>
          {errors?.thumbnail && (
            <p className="ml-1 mt-1 text-sm text-red-500">
              {String(errors?.thumbnail?.message) ||
                t("addBusiness:error.missingField")}
            </p>
          )}
        </div>
        {/* ----------------- */}
        <div>
          <span className="text-lg font-semibold">
            {t("addBusiness:step3.picturesPlace")}
          </span>
          <div className="mt-5 ">
            <RHFUploadImage name="images" isMultiple />
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAddBusiness4;
