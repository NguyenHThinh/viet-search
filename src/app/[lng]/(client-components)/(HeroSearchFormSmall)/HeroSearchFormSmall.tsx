"use client";

import type { FC } from "react";
import React, { useEffect, useState } from "react";

import type { StaySearchFormFields } from "../type";
import RentalCarSearchForm from "./(car-search-form)/RentalCarSearchForm";
import ExperiencesSearchForm from "./(experiences-search-form)/ExperiencesSearchForm";
import FlightSearchForm from "./(flight-search-form)/FlightSearchForm";
import StaySearchForm from "./(stay-search-form)/StaySearchForm";

export type SearchTab = "Stays" | "Experiences" | "Cars" | "Flights";

export interface HeroSearchFormSmallProps {
  className?: string;
  defaultTab?: SearchTab;
  onTabChange?: (tab: SearchTab) => void;
  defaultFieldFocus?: StaySearchFormFields;
}
const TABS: SearchTab[] = ["Stays", "Experiences", "Cars", "Flights"];

const HeroSearchFormSmall: FC<HeroSearchFormSmallProps> = ({
  className = "",
  defaultTab = "Stays",
  onTabChange,
  defaultFieldFocus,
}) => {
  const [tabActive, setTabActive] = useState<SearchTab>(defaultTab);

  useEffect(() => {
    setTabActive(defaultTab);
  }, [defaultTab]);

  const renderTab = () => {
    return (
      <ul className="flex h-[88px] justify-center space-x-5 sm:space-x-9">
        {TABS.map((tab) => {
          const active = tab === tabActive;
          return (
            <li
              onClick={() => {
                setTabActive(tab);
                onTabChange && onTabChange(tab);
              }}
              className={`relative flex shrink-0 cursor-pointer items-center text-base ${
                active
                  ? "font-medium text-neutral-900 dark:text-neutral-200"
                  : "text-neutral-500 dark:text-neutral-300 "
              } `}
              key={tab}
            >
              <div className="relative select-none">
                <span>{tab}</span>
                {active && (
                  <span className="absolute top-full mr-2 mt-1 block h-0.5 w-full rounded-full bg-neutral-800 dark:bg-neutral-100" />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderForm = () => {
    switch (tabActive) {
      case "Stays":
        return <StaySearchForm defaultFieldFocus={defaultFieldFocus} />;
      case "Experiences":
        return <ExperiencesSearchForm />;
      case "Cars":
        return <RentalCarSearchForm />;
      case "Flights":
        return <FlightSearchForm />;

      default:
        return null;
    }
  };

  return (
    <div
      className={`nc-HeroSearchFormSmall ${className}`}
      data-nc-id="HeroSearchFormSmall"
    >
      {renderTab()}
      <div className="mt-2">{renderForm()}</div>
    </div>
  );
};

export default HeroSearchFormSmall;
