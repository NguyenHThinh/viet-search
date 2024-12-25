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
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex shrink-0 flex-col items-start space-y-6 pb-14 lg:mr-10 lg:w-1/2 lg:space-y-10 lg:pb-64 xl:mr-0 xl:pb-80 xl:pr-14">
          <h2 className="text-4xl font-medium leading-[110%] md:text-5xl xl:text-7xl">
            Tokyo, Jappan
          </h2>
          <div className="flex items-center text-base text-neutral-500 dark:text-neutral-400 md:text-lg">
            <i className="las la-map-marked text-2xl" />
            <span className="ml-2.5">Jappan </span>
            <span className="mx-5" />
            {listingType || (
              <>
                <i className="las la-home text-2xl" />
                <span className="ml-2.5">112 properties</span>
              </>
            )}
          </div>
        </div>
        <div className="grow">
          <Image
            className="w-full"
            src={rightImage}
            alt="hero"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          />
        </div>
      </div>

      <div className="hidden w-full lg:flow-root">
        <div className="z-10 w-full lg:-mt-40 xl:-mt-56">
          <HeroSearchForm currentPage={currentPage} currentTab={currentTab} />
        </div>
      </div>
    </div>
  );
};

export default SectionHeroArchivePage;
