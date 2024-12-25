"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { FC, ReactNode } from "react";
import React, { useEffect, useState } from "react";

import ButtonSecondary from "@/shared/ButtonSecondary";
import Heading from "@/shared/Heading";
import Nav from "@/shared/Nav";
import NavItem from "@/shared/NavItem";
import { PATH_PAGE } from "@/contains/paths";
import { useRouter } from "next/navigation";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";
import { useTranslation } from "@/app/i18n/client";

export interface HeaderFilterProps {
  tabActive: string;
  tabs: string[];
  heading: ReactNode;
  subHeading?: ReactNode;
  onClickTab?: (item: string) => void;
}

const HeaderFilter: FC<HeaderFilterProps> = ({
  tabActive,
  tabs,
  subHeading = "",
  heading = "Latest Articles 🎈",
  onClickTab = () => {},
}) => {
  const { t, i18n } = useTranslation("common");
  const { setFilter } = useBusinessSearchContext();
  const [tabActiveState, setTabActiveState] = useState(tabActive);

  useEffect(() => {
    setTabActiveState(tabActive);
  }, [tabActive]);

  const handleClickTab = (item: string) => {
    onClickTab(item);
    setTabActiveState(item);
  };

  return (
    <div className="relative mb-8 flex flex-col">
      <Heading desc={subHeading}>{heading}</Heading>
      <div className="flex items-center justify-between">
        <Nav
          className="sm:space-x-2"
          containerClassName="relative flex w-full overflow-x-auto text-sm md:text-base hiddenScrollbar"
        >
          {tabs.map((item, index) => (
            <NavItem
              key={index}
              isActive={tabActiveState === item}
              onClick={() => handleClickTab(item)}
            >
              {item}
            </NavItem>
          ))}
        </Nav>
        <span className="hidden shrink-0 sm:block">
          <ButtonSecondary
            onClick={() => {
              setFilter({});
            }}
            className="!leading-none"
          >
            <div className="flex items-center justify-center">
              <span>{t("viewAll")}</span>
              <ArrowRightIcon className="ml-3 h-5 w-5" />
            </div>
          </ButtonSecondary>
        </span>
      </div>
    </div>
  );
};

export default HeaderFilter;
