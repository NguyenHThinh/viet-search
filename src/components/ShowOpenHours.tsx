import { IClosedDay, IOpenHours } from "@/models/iOpenHours";
import convertMillisecondsToTime from "@/utils/convertMillisecondsToTime";
import sortDaysOfWeek from "@/utils/sortDayOfWeek";
import RenderDayOfWeek from "./RenderDayOfWeek";
import { useTranslation } from "@/app/i18n/client";

interface ShowOpenHoursProps {
  openHours: IOpenHours;
}

const ShowOpenHours = ({ openHours }: ShowOpenHoursProps) => {
  const { t } = useTranslation(["common", "openHours"]);

  const renderTypeOpenHours = (type: string) => {
    switch (type) {
      case "mainHours":
        return (
          <p className="text-lg font-medium">{t("openHours:openMainHours")}</p>
        );
      case "noMainHours":
        return (
          <p className="text-lg font-medium">
            {t("openHours:openNoMainHours")}
          </p>
        );
      case "temporaryClosed":
        return (
          <p className="text-lg font-medium">
            {t("openHours:temporarilyClosed")}
          </p>
        );
      case "closed":
        return (
          <p className="text-lg font-medium">
            {t("openHours:permanentlyClosed")}
          </p>
        );
      default:
        return (
          <p className="text-lg font-medium">
            {t("openHours:openNoMainHours")}
          </p>
        );
    }
  };

  const sortedDayOfWeek = sortDaysOfWeek(openHours?.dayOfWeek);

  return (
    <div className="space-y-3">
      {renderTypeOpenHours(openHours?.type)}
      {openHours.type === "mainHours" &&
        Object.keys(sortedDayOfWeek).map((day, index) => (
          <div key={index} className="grid grid-cols-4">
            <p>
              <RenderDayOfWeek day={day} />
            </p>
            <div className="space-y-2">
              {sortedDayOfWeek[day as keyof IClosedDay].length > 0 ? (
                sortedDayOfWeek[day as keyof IClosedDay].map((item, index) => (
                  <p key={index}>
                    {convertMillisecondsToTime(Number(item.from))}
                    {" - "}
                    {convertMillisecondsToTime(Number(item.to))}
                  </p>
                ))
              ) : (
                <p>{t("common:closeBusiness")}</p>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ShowOpenHours;
