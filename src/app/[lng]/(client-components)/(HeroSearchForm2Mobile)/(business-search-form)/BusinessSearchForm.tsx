"use client";

import React, { FC, useState } from "react";

import BusinessInput from "../BusinessInput";
import WhereInput from "../WhereInput ";
import { useTranslation } from "@/app/i18n/client";

interface BusinessSearchFormProps {
  value: { q: string; where: string };
  setValue: (value: { q: string; where: string }) => void;
}

const BusinessSearchForm: FC<BusinessSearchFormProps> = ({
  value,
  setValue,
}) => {
  const { t, i18n } = useTranslation(["common", "search"]);
  const [fieldNameShow, setFieldNameShow] = useState<"what" | "where">("what");

  const setInputQueryWhat = (q: string) => {
    setValue({
      ...value,
      q,
    });
  };

  const setInputQueryWhere = (where: string) => {
    setValue({
      ...value,
      where,
    });
  };

  const renderInputWhat = () => {
    const isActive = fieldNameShow === "what";
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className="flex w-full justify-between p-4 text-sm font-medium"
            onClick={() => setFieldNameShow("what")}
          >
            <span className="text-neutral-400">{t("search:whatFinding")}</span>
            <span>{value?.q || t("common:business")}</span>
          </button>
        ) : (
          <BusinessInput defaultValue={value?.q} setValue={setInputQueryWhat} />
        )}
      </div>
    );
  };

  const renderInputWhere = () => {
    const isActive = fieldNameShow === "where";
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className="flex w-full justify-between p-4 text-sm font-medium"
            onClick={() => setFieldNameShow("where")}
          >
            <span className="text-neutral-400">{t("search:whereGoing")}</span>
            <span>{value?.where || t("common:location")}</span>
          </button>
        ) : (
          <WhereInput
            defaultValue={value?.where}
            setValue={setInputQueryWhere}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="w-full space-y-5">
        {/*  */}
        {renderInputWhat()}
        {/*  */}
        {renderInputWhere()}
        {/*  */}
      </div>
    </div>
  );
};

export default BusinessSearchForm;
