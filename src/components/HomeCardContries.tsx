import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React from "react";

import convertNumbThousand from "@/utils/convertNumbThousand";
import { iCountriesHomePage } from "@/models/iHomepageCats";
import { PATH_PAGE } from "@/contains/paths";
import { TFunction } from "i18next";

export interface HomeCardContriesProps {
  className?: string;
  cardData: iCountriesHomePage;
  lng: string;
  t: TFunction;
}

const HomeCardContries: FC<HomeCardContriesProps> = ({
  className = "",
  cardData,
  lng,
  t,
}) => {
  return (
    <Link
      href={{
        pathname: PATH_PAGE?.searchBusiness,
        query: { countries: cardData?.value.toUpperCase() },
      }}
      className={`nc-CardCategory3 flex flex-col ${className}`}
    >
      <div className="group aspect-h-5 aspect-w-5 relative h-0 w-full shrink-0 overflow-hidden rounded-2xl sm:aspect-h-6">
        <Image
          src={
            "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
          }
          className="h-full w-full rounded-2xl object-cover"
          alt="places"
          fill
          sizes="(max-width: 400px) 100vw, 300px"
        />
        <span className="absolute inset-0 bg-black bg-opacity-10 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mt-4 truncate">
        <h2 className="truncate text-base font-medium text-neutral-900 dark:text-neutral-100 sm:text-lg">
          {cardData?.names?.[lng] ?? cardData?.value}
        </h2>
        <span className="mt-1.5 block text-sm text-neutral-6000 dark:text-neutral-400">
          {convertNumbThousand(cardData?.doc_count || 0)} {t("results")}
        </span>
      </div>
    </Link>
  );
};

export default HomeCardContries;
