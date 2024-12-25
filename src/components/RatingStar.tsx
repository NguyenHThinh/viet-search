"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import React, { useState } from "react";

export interface RatingStarProps {
  className?: string;
  iconClass?: string;
  defaultPoint: number;
  setStar: (star: number) => void;
}

const RatingStar: FC<RatingStarProps> = ({
  className = "",
  iconClass = "w-4 h-4",
  defaultPoint,
  setStar,
}) => {
  const [currentHover, setCurrentHover] = useState(0);

  return (
    <div
      className={`nc-FiveStartIconForRate flex items-center text-neutral-300 ${className}`}
      data-nc-id="FiveStartIconForRate"
    >
      {[1, 2, 3, 4, 5].map((item) => {
        return (
          <StarIcon
            key={item}
            className={`${
              defaultPoint >= item || currentHover >= item
                ? "text-yellow-500"
                : ""
            } ${iconClass}`}
            onMouseEnter={() => setCurrentHover(() => item)}
            onMouseLeave={() => setCurrentHover(() => 0)}
            onClick={() => setStar(item)}
          />
        );
      })}
    </div>
  );
};

export default RatingStar;
