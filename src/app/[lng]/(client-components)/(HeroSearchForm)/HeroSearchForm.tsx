"use client";

import type { FC } from "react";
import React, { useEffect, useState } from "react";

// import RentalCarSearchForm from "./(car-search-form)/RentalCarSearchForm";
// import ExperiencesSearchForm from "./(experiences-search-form)/ExperiencesSearchForm";
// import FlightSearchForm from "./(flight-search-form)/FlightSearchForm";
// import StaySearchForm from "./(stay-search-form)/StaySearchForm";
import { useSearchParams } from "next/navigation";
import BusinessSearchForm from "./(business-search-form)/BusinessSearchForm";

export type SearchTab = "Stays" | "Experiences" | "Cars" | "Flights";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: SearchTab;
  currentPage?: "Stays" | "Experiences" | "Cars" | "Flights";
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Stays",
  currentPage,
}) => {
  const tabs: SearchTab[] = ["Stays", "Experiences", "Cars", "Flights"];
  const [tabActive, setTabActive] = useState<SearchTab>(currentTab);
  const params = useSearchParams();
  const [value, setValue] = useState({
    q: "",
    where: "",
  });

  useEffect(() => {
    setValue({
      q: params.get("q") ?? "",
      where: params.get("where") ?? "",
    });
  }, [params]);

  const renderTab = () => {
    return (
      <ul className="hiddenScrollbar ml-2 flex space-x-5 overflow-x-auto sm:ml-6 sm:space-x-8 md:ml-12 lg:space-x-11">
        {tabs.map((tab) => {
          const active = tab === tabActive;
          return (
            <li
              onClick={() => setTabActive(tab)}
              className={`flex shrink-0 cursor-pointer items-center text-sm font-medium lg:text-base ${
                active
                  ? ""
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-400"
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
    return <BusinessSearchForm value={value} setValue={setValue} />;
    // switch (tabActive) {
    //   case "Stays":
    //     return <StaySearchForm />;
    //   case "Experiences":
    //     return <ExperiencesSearchForm />;
    //   case "Cars":
    //     return <RentalCarSearchForm />;
    //   case "Flights":
    //     return <FlightSearchForm />;

    //   default:
    //     return null;
    // }
  };

  return (
    <div
      className={`nc-HeroSearchForm w-full max-w-6xl py-5 lg:py-0 ${className}`}
    >
      {/* {renderTab()} */}
      {renderForm()}
    </div>
  );
};

export default HeroSearchForm;
