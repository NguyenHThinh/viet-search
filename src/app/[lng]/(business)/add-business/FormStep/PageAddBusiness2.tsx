"use client";

import React, { FC, useEffect, useState } from "react";
import FormItem from "../components/FormItem";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import SelectCountry from "../components/SelectCountry";
import { FieldErrorsImpl, useFormContext } from "react-hook-form";
import { iFormSchema } from "../form-config";
import AddContact from "../components/AddContact";
import { useTranslation } from "@/app/i18n/client";

export interface PageAddBusiness2Props {}

const PageAddBusiness2: FC<PageAddBusiness2Props> = () => {
  const { t } = useTranslation(["addBusiness"]);

  const {
    register,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [displayedValue, setDisplayedValue] = useState("");

  return (
    <>
      <h2 className="text-2xl font-semibold">
        {t("addBusiness:step2.businessLocation")}
      </h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* <ButtonSecondary>
          <MapPinIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          <span className="ml-3">Use current location</span>
        </ButtonSecondary> */}
        {/* ITEM */}
        <FormItem
          label={t("addBusiness:step2.fullAddress")}
          required
          desc={t("addBusiness:step2.thisAddress")}
        >
          <Input
            placeholder={t("addBusiness:step2.exampleAddress")}
            {...register("address.displayed")}
            onChange={(e) => setDisplayedValue(e.target.value)}
            onClick={() => clearErrors("address.displayed")}
          />
          {(errors.address as FieldErrorsImpl<iFormSchema["address"]>)
            ?.displayed && (
            <p className="ml-1 mt-1 text-sm text-red-500">
              {String(
                (errors.address as FieldErrorsImpl<iFormSchema["address"]>)
                  ?.displayed?.message,
              ) || t("addBusiness:error.missingField")}
            </p>
          )}
        </FormItem>

        <SelectCountry />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-5">
          <FormItem label={t("addBusiness:step2.street")}>
            <Input
              {...register("address.street")}
              onClick={() => clearErrors("address.street")}
            />
          </FormItem>
          <FormItem label={t("addBusiness:step2.state")}>
            <Input
              {...register("address.state")}
              onClick={() => clearErrors("address.state")}
            />
          </FormItem>
          <FormItem label={t("addBusiness:step2.postalCode")}>
            <Input
              {...register("address.zipcode")}
              onClick={() => clearErrors("address.zipcode")}
            />
          </FormItem>
        </div>
        <div>
          <Label>{t("addBusiness:step2.detailAddress")}</Label>
          <span className="mt-1 block text-sm text-neutral-500 dark:text-neutral-400">
            {displayedValue}
          </span>
          <div className="mt-4">
            <div className="aspect-h-5 aspect-w-5 sm:aspect-h-3">
              <div className="overflow-hidden rounded-xl">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAGVJfZMAKYfZ71nzL_v5i3LjTTWnCYwTY&q=${displayedValue || "hà nội, việt nam"}`}
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
        <AddContact />
      </div>
    </>
  );
};

export default PageAddBusiness2;
