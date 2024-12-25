import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React from "react";

import { IBusiness } from "@/models/iBusiness";
import BusinessStartRating from "./BusinessStartRating";
import NextBusinessImage from "@/components/NextBusinessImage";
import { PATH_PAGE } from "@/contains/paths";

export interface HomeCardBusinessProps {
  className?: string;
  cardData: IBusiness;
  lng: string;
}

const HomeCardBusiness: FC<HomeCardBusinessProps> = ({
  className = "",
  cardData,
  lng,
}) => {
  return (
    <Link
      href={PATH_PAGE?.business.detail(cardData?.slug ?? cardData?.id ?? "")}
      className={`nc-CardCategory5 flex flex-col ${className}`}
      data-nc-id="CardCategory5"
    >
      <div className="group aspect-h-3 aspect-w-4 relative w-full shrink-0 overflow-hidden rounded-2xl">
        <NextBusinessImage
          fill
          alt=""
          src={cardData?.thumbnail ?? ""}
          className="h-full w-full rounded-2xl object-cover"
          sizes="(max-width: 400px) 100vw, 400px"
        />
        <span className="absolute inset-0 bg-black bg-opacity-10 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mb-2 mt-4 flex-1 truncate px-3">
        <h2 className="line-clamp-2 whitespace-break-spaces text-base font-medium text-neutral-900 dark:text-neutral-100 sm:text-lg">
          {cardData?.names?.[lng] || cardData?.name || ""}
        </h2>
        <span className="mt-2 block truncate text-sm text-neutral-6000 dark:text-neutral-400">
          {cardData?.address?.displayed || cardData?.address?.country || ""}
        </span>
        {!!cardData?.overview_rating?.average && (
          <BusinessStartRating
            reviewCount={0}
            point={cardData.overview_rating.average}
          />
        )}
      </div>
    </Link>
  );
};

export default HomeCardBusiness;
