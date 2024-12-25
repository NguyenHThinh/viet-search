import { StarIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import React from "react";

export interface StartRatingProps {
  className?: string;
  point?: number;
  reviewCount?: number;
}

const StartRating: FC<StartRatingProps> = ({
  className = "",
  point = 4.5,
  reviewCount,
}) => {
  return (
    <div
      className={`nc-StartRating flex items-center space-x-1 text-sm  ${className}`}
      data-nc-id="StartRating"
    >
      <div className="pb-[2px]">
        <StarIcon className="h-[18px] w-[18px] text-orange-500" />
      </div>
      <span className="font-medium ">{point}</span>
      {reviewCount && (
        <span className="text-neutral-500 dark:text-neutral-400">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default StartRating;