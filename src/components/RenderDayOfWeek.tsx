"use client";

import { useTranslation } from "@/app/i18n/client";

const RenderDayOfWeek = ({ day }: { day: string }) => {
  const { t } = useTranslation(["openHours"]);

  const dayFormat: Record<string, string> = {
    mon: t("openHours:monday"),
    tue: t("openHours:tueday"),
    wed: t("openHours:wednesday"),
    thu: t("openHours:thursday"),
    fri: t("openHours:friday"),
    sat: t("openHours:saturday"),
    sun: t("openHours:sunday"),
  };

  return <span>{dayFormat[day] || ""}</span>;
};

export default RenderDayOfWeek;
