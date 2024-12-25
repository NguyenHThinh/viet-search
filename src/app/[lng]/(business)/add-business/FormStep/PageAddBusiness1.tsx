"use client";

import React, { FC } from "react";
import FormItem from "../components/FormItem";
import { Controller, useFormContext } from "react-hook-form";
import Textarea from "@/shared/Textarea";
import AddCatsForm from "../components/AddCatsForm";
import KeywordsField from "../components/KeywordsField";
import { useTranslation } from "@/app/i18n/client";
import RHFTextField from "@/components/RHFTextField";
import { BUSINESS_TYPE, BusinessTypeKey } from "@/constants/business";

export interface PageAddBusiness1Props {}

const PageAddBusiness1: FC<PageAddBusiness1Props> = () => {
  const {
    setValue,
    getValues,
    register,
    clearErrors,
    formState: { errors },
    control,
  } = useFormContext();

  const { t } = useTranslation(["addBusiness"]);

  return (
    <>
      <h2 className="text-2xl font-semibold">
        {t("addBusiness:step1.businessInfomation")}
      </h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* ITEM */}
        <RHFTextField
          name="name"
          label={t("addBusiness:step1.businessName")}
          required
          placeholder={t("addBusiness:step1.businessName")}
        />
        <FormItem required label={t("addBusiness:step1.chooseType")}>
          <Controller
            name="types"
            control={control}
            defaultValue={getValues("types") || []}
            render={({ field }) => (
              <select
                {...field}
                value={field.value[0] || ""}
                onChange={(e) => {
                  field.onChange([e.target.value]);
                }}
                onFocus={() => clearErrors("types")}
                className="block h-11 w-full rounded-2xl border-neutral-200 bg-white text-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25"
              >
                {Object.keys(BUSINESS_TYPE).map((key) => {
                  const typedKey = key as BusinessTypeKey;
                  return (
                    <option
                      key={typedKey}
                      value={BUSINESS_TYPE[typedKey] || ""}
                    >
                      {t(`addBusiness:types.${typedKey}`) ?? ""}
                    </option>
                  );
                })}
              </select>
            )}
          />
          {errors?.types && (
            <p className="ml-1 mt-1 text-sm text-red-500">
              {String(errors?.types?.message) ||
                t("addBusiness:error.missingField")}
            </p>
          )}
        </FormItem>
        <FormItem
          required
          label={t("addBusiness:step1.businessDesc")}
          // desc="A catchy name usually includes: House name + Room name + Featured property + Tourist destination"
        >
          <Textarea
            {...register("description")}
            placeholder={t("addBusiness:step1.describe")}
            rows={8}
            className={errors?.description && "border-red-500"}
            onChange={(e) => {
              const value = e.target.value;
              // Set the main field and duplicate its value to other fields
              setValue("description", value);
              setValue("descriptions.en", value);
              setValue("descriptions.vi", value);
            }}
            onFocus={() => {
              clearErrors("description");
            }}
          />
          {errors?.description && (
            <p className="ml-1 mt-1 text-sm text-red-500">
              {String(errors?.description?.message) ||
                t("addBusiness:error.missingField")}
            </p>
          )}
        </FormItem>

        <AddCatsForm />

        <KeywordsField />
      </div>
    </>
  );
};

export default PageAddBusiness1;
