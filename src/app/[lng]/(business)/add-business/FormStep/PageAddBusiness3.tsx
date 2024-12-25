"use client";

import { useTranslation } from "@/app/i18n/client";
import UpdateOpenHours from "@/components/UpdateOpenHours";
import React, { FC } from "react";

export interface PageAddBusiness3Props {}

const PageAddBusiness3: FC<PageAddBusiness3Props> = () => {
  const { t } = useTranslation(["addBusiness"]);

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">{t("step4.hour")}</h2>
        <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
          {t("addBusiness:step4.mainBusinessHour")}
        </span>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <UpdateOpenHours />
    </>
  );
};

export default PageAddBusiness3;
