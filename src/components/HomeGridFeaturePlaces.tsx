"use client";

import type { FC, ReactNode } from "react";
import React, { useState } from "react";

import ButtonPrimary from "@/shared/ButtonPrimary";

import HeaderFilter from "./HeaderFilter";
import { IBusiness } from "@/models/iBusiness";
import BusinessCard from "./BusinessCard";
import BusinessCard2 from "./BusinessCard2";
import { iCountriesHomePage } from "@/models/iHomepageCats";
import Link from "next/link";
import { PATH_PAGE } from "@/contains/paths";
import ListTypePropertyCard from "./ListTypePropertyCard";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";
import { useTranslation } from "@/app/i18n/client";

//
export interface HomeGridFeaturePlacesProps {
  featureListings: iCountriesHomePage[];
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  cardType?: "card1" | "card2";
}

const HomeGridFeaturePlaces: FC<HomeGridFeaturePlacesProps> = ({
  featureListings,
  gridClass = "",
  heading = "Featured places to stay",
  subHeading = "Popular places to stay that Chisfis recommends for you",
  headingIsCenter,
  cardType = "card2",
}) => {
  const { t, i18n } = useTranslation("common");
  const { setFilter } = useBusinessSearchContext();
  const [tabActive, setTabActive] = useState(0);
  const tabs = featureListings?.length
    ? featureListings?.map(
        (country) => country?.names?.[i18n.language] || country?.name || "",
      )
    : [];

  const handleSetActiveTab = (item: string) => {
    const index = tabs.indexOf(item);
    setTabActive(index);
  };

  const renderCard = (business: IBusiness) => {
    let CardName = BusinessCard;
    switch (cardType) {
      case "card1":
        CardName = BusinessCard;
        break;
      case "card2":
        CardName = BusinessCard2;
        break;

      default:
        CardName = BusinessCard;
    }

    return <CardName key={business.id} data={business} lng={i18n.language} />;
  };

  // const renderCard = (business: IBusiness) => {
  //   return (
  //     <ListTypePropertyCard
  //       className="h-full"
  //       data={business}
  //       lng={i18n.language}
  //     />
  //   );
  // };

  return (
    <div className="nc-HomeGridFeaturePlaces relative">
      <HeaderFilter
        tabActive={tabs[tabActive]}
        subHeading={subHeading}
        tabs={tabs}
        heading={heading}
        onClickTab={handleSetActiveTab}
      />
      <div
        className={`grid grid-cols-1 gap-3 min-[425px]:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8 ${gridClass}`}
      >
        {featureListings?.[tabActive]?.items?.length &&
          featureListings?.[tabActive]?.items?.map((item, index) => {
            return <div key={index}>{renderCard(item)}</div>;
          })}
      </div>
      <div className="mt-16 flex items-center justify-center">
        <ButtonPrimary
          onClick={() => {
            setFilter({ where: tabs[tabActive] });
          }}
        >
          {t("showMore")}
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default HomeGridFeaturePlaces;
