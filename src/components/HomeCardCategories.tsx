import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React from "react";

import convertNumbThousand from "@/utils/convertNumbThousand";
import { iCategory } from "@/models/iFacets";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";
import { TFunction } from "i18next";

export interface HomeCardCategoriesProps {
  className?: string;
  cardData: iCategory;
  lng: string;
  t: TFunction;
}

const HomeCardCategories: FC<HomeCardCategoriesProps> = ({
  className = "",
  cardData,
  lng,
  t,
}) => {
  const { setFilter } = useBusinessSearchContext();
  return (
    <Link
      href={""}
      className={`nc-CardCategory4 flex flex-col ${className}`}
      data-nc-id="CardCategory4"
      onClick={(e) => {
        e.preventDefault();
        setFilter({ categories: cardData?.value });
      }}
    >
      {/*<div className="group aspect-h-3 aspect-w-4 relative h-0 w-full shrink-0 overflow-hidden rounded-2xl">*/}
      {/*<Image*/}
      {/*  src={*/}
      {/*    "https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"*/}
      {/*  }*/}
      {/*  className="h-full w-full rounded-2xl object-cover"*/}
      {/*  fill*/}
      {/*  alt="archive"*/}
      {/*  sizes="(max-width: 400px) 100vw, 400px"*/}
      {/*/>*/}
      {/*<span className="absolute inset-0 bg-black bg-opacity-10 opacity-0 transition-opacity group-hover:opacity-100" />*/}
      {/*</div>*/}
      <div className="nc-CardCategoryBox1 [ nc-box-has-hover ] [ nc-dark-box-bg-has-hover ] relative  items-center p-3 sm:p-6 ">
        <div className="truncate text-center ">
          <h2 className="truncate text-base font-medium text-neutral-900 dark:text-neutral-100 sm:text-lg">
            {cardData?.names?.[lng] ?? cardData?.name ?? ""}
          </h2>
          <span className="mt-2 block text-sm text-neutral-6000 dark:text-neutral-400">
            {convertNumbThousand(cardData?.doc_count || 0)}
            {` `} {t("results")}
            {/* {(!listingType || listingType === "stay") && "properties"}
          {listingType === "car" && "cars"}
          {listingType === "experiences" && "experiences"} */}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HomeCardCategories;
