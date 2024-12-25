"use client";

import { useTranslation } from "@/app/i18n/client";
import { IOpenHours } from "@/models/iOpenHours";
import checkOpenOrClose from "@/utils/checkOpenOrClose";
import convertMillisecondsToTime from "@/utils/convertMillisecondsToTime";

const ShowOpenState = ({ openHour }: { openHour: IOpenHours }) => {
  const { t } = useTranslation(["common", "detail"]);

  if (openHour.type === "noMainHours") {
    return (
      <span className="mr-1 inline-block font-medium text-green-600">
        {t("common:open")}
      </span>
    );
  }

  const openState = checkOpenOrClose(openHour.dayOfWeek);

  if (openHour.type === "mainHours") {
    return openState.isOpen ? (
      <span className="mr-1 inline-block font-medium text-green-600">
        {t("open")}
        <span className="ml-2 font-normal text-neutral-900 dark:text-neutral-200">{`${t("detail:until")} ${convertMillisecondsToTime(openState.timeRange?.to || 0)}`}</span>
      </span>
    ) : (
      <span className="mr-1 inline-block font-medium text-red-600">
        {t("closeBusiness")}
        <span className="ml-2 font-normal text-neutral-900 dark:text-neutral-200">{`${t("detail:until")} ${convertMillisecondsToTime(openState.timeRange?.from || 0)}`}</span>{" "}
        <span className="font-normal text-neutral-900 dark:text-neutral-200">
          {openState.day && openState.day === 1
            ? `${t("detail:tomorrow")}`
            : `(${openState.day} ${t("detail:dayLater")})`}
        </span>
      </span>
    );
  }

  return <></>;
};

export default ShowOpenState;
