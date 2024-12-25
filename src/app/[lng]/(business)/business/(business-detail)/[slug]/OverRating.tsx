"use client";

import { useTranslation } from "@/app/i18n/client";
import ShowRatingStar from "@/components/ShowRatingStar";
import { IBusinessRating } from "@/models/iBusiness";

interface IOverRatingProps {
  overRating: IBusinessRating;
}

const OverRating: React.FunctionComponent<IOverRatingProps> = ({
  overRating,
}) => {
  const { t } = useTranslation(["detail"]);

  const renderCountDetailRating = () => {
    const levelRating = Object.keys(overRating?.levels);
    const countRating = Object.values(overRating?.levels).reverse();
    return (
      <div className="space-y-2">
        {levelRating.reverse().map((level, index) => (
          <div
            key={level}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
          >
            <p>{`${level} ${t("detail:stars")}`}</p>
            <progress
              className="h-1 w-52"
              value={countRating?.[index]}
              max={overRating?.total}
            ></progress>
            <p>{countRating?.[index]}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex  flex-col items-center justify-center space-y-4 md:flex-row md:space-x-24">
      <div className="space-y-2">
        <h2 className="text-xl font-medium">{t("detail:overallRating")}</h2>
        <ShowRatingStar rating={overRating?.average} size="h-5 w-5" />
        <p>{`${overRating?.total} ${t("detail:reviews")}`}</p>
      </div>
      <div>{renderCountDetailRating()}</div>
    </div>
  );
};

export default OverRating;
