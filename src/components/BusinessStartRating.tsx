import { StarIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import React from "react";

export interface BusinessStartRatingProps {
  className?: string;
  point?: number;
  reviewCount?: number;
}

const BusinessStartRating: FC<BusinessStartRatingProps> = ({
  className = "",
  point,
  reviewCount,
}) => {
  return (
    <div
      className={`nc-BusinessStartRating flex items-center space-x-1 text-sm  ${className}`}
      data-nc-id="BusinessStartRating"
    >
      <div className="pb-[2px]">
        <StarIcon className="h-[18px] w-[18px] text-orange-500" />
      </div>
      <span className="font-medium ">{point}</span>
      {!!reviewCount && (
        <span className="text-neutral-500 dark:text-neutral-400">
          ({reviewCount.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default BusinessStartRating;
