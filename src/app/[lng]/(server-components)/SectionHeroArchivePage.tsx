import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC, ReactNode } from "react";
import React from "react";

import imagePng from "@/images/hero-right2.png";

import type { SearchTab } from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import HeroSearchForm from "../(client-components)/(HeroSearchForm)/HeroSearchForm";

export interface SectionHeroArchivePageProps {
  className?: string;
  listingType?: ReactNode;
  currentPage: "Stays" | "Experiences" | "Cars" | "Flights";
  currentTab: SearchTab;
  rightImage?: StaticImageData;
}

const SectionHeroArchivePage: FC<SectionHeroArchivePageProps> = ({
  className = "",
  listingType,
  currentPage,
  currentTab,
  rightImage = imagePng,
}) => {
  return (
    <div
      className={`nc-SectionHeroArchivePage relative flex flex-col ${className}`}
      data-nc-id="SectionHeroArchivePage"
    >
      <div className="hidden w-full lg:flex">
        <HeroSearchForm currentPage={currentPage} currentTab={currentTab} />
      </div>
    </div>
  );
};

export default SectionHeroArchivePage;
