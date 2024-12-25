import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React from "react";

import BtnLikeIcon from "@/components/BtnLikeIcon";
import SaleOffBadge from "@/components/SaleOffBadge";
import StartRating from "@/components/StartRating";
import { DEMO_CAR_LISTINGS } from "@/data/listings";
import type { CarDataType } from "@/data/types";
import Badge from "@/shared/Badge";

export interface CarCardProps {
  className?: string;
  data?: CarDataType;
  size?: "default" | "small";
}

const DEMO_DATA: CarDataType = DEMO_CAR_LISTINGS[0];

const CarCard: FC<CarCardProps> = ({
  size = "default",
  className = "",
  data = DEMO_DATA,
}) => {
  const {
    featuredImage,
    title,
    href,
    like,
    saleOff,
    isAds,
    price,
    reviewStart,
    reviewCount,
    seats,
    gearshift,
  } = data;

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl">
        <div className="aspect-h-9 aspect-w-16 ">
          <Image
            fill
            src={featuredImage}
            alt="car"
            sizes="(max-width: 640px) 100vw, 350px"
          />
        </div>
        <BtnLikeIcon isLiked={like} className="absolute right-3 top-3 z-[1]" />
        {saleOff && <SaleOffBadge className="absolute left-3 top-3" />}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={size === "default" ? "space-y-4  p-5" : "space-y-2  p-3"}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {isAds && <Badge name="ADS" color="green" />}
            <h2
              className={`  capitalize ${
                size === "default"
                  ? "text-xl font-semibold"
                  : "text-base font-medium"
              }`}
            >
              <span className="line-clamp-1">{title}</span>
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="">{seats} seats</span>
            <span>-</span>
            <span className="">{gearshift} </span>
          </div>
        </div>
        <div className="w-14  border-b border-neutral-100 dark:border-neutral-800" />
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">
            {price}
            {` `}
            {size === "default" && (
              <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                /day
              </span>
            )}
          </span>
          <StartRating reviewCount={reviewCount} point={reviewStart} />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-CarCard group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
      data-nc-id="CarCard"
    >
      <Link href={href} className="flex flex-col">
        {renderSliderGallery()}
        {renderContent()}
      </Link>
    </div>
  );
};

export default CarCard;