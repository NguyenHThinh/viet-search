"use client";

import type { FC } from "react";
import React, { useState } from "react";

import RealEstateSearchForm from "./RealEstateSearchForm";

export type SearchRealEstateTab = "Buy" | "Rent" | "Sell";

export interface HeroRealEstateSearchFormProps {
  className?: string;
  currentTab?: SearchRealEstateTab;
}

const HeroRealEstateSearchForm: FC<HeroRealEstateSearchFormProps> = ({
  className = "",
  currentTab = "Buy",
}) => {
  const tabs: SearchRealEstateTab[] = ["Buy", "Rent", "Sell"];
  const [tabActive, setTabActive] = useState<SearchRealEstateTab>(currentTab);

  const renderTab = () => {
    return (
      <ul className="ml-6 inline-flex space-x-4 rounded-t-3xl bg-white !pl-0 pb-6 dark:bg-neutral-900 sm:space-x-8 md:ml-16 md:p-6 lg:space-x-10 xl:ml-20 xl:p-0">
        {tabs.map((tab) => {
          const active = tab === tabActive;
          return (
            <li
              onClick={() => setTabActive(tab)}
              className={`flex cursor-pointer items-center text-sm font-medium lg:text-base ${
                active
                  ? ""
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-100"
              } `}
              key={tab}
            >
              {active && (
                <span className="mr-2 block h-2.5 w-2.5 rounded-full bg-neutral-800 dark:bg-neutral-100" />
              )}
              <span>{tab}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderForm = () => {
    switch (tabActive) {
      case "Buy":
        return <RealEstateSearchForm />;

      default:
        return <RealEstateSearchForm />;
    }
  };

  return (
    <div
      className={`nc-HeroRealEstateSearchForm w-full max-w-6xl py-5 lg:py-0 ${className}`}
    >
      {renderTab()}
      {renderForm()}
    </div>
  );
};

export default HeroRealEstateSearchForm;
