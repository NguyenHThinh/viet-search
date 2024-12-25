import Image from "next/image";
import type { FC } from "react";
import React from "react";

import imagePng from "@/images/hero-right.png";
import ButtonPrimary from "@/shared/ButtonPrimary";

import HeroSearchForm from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import { PATH_PAGE } from "@/contains/paths";
import { TFunction } from "i18next";

export interface SectionHeroProps {
  className?: string;
  t: TFunction;
}

const SectionHero: FC<SectionHeroProps> = ({ className = "", t }) => {
  return (
    <div
      className={`nc-SectionHero relative flex flex-col-reverse lg:flex-col ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex shrink-0 flex-col items-start space-y-8 pb-14 sm:space-y-10 lg:mr-10 lg:w-1/2 lg:pb-64 xl:mr-0 xl:pr-14">
          <h2 className="text-4xl font-medium !leading-[114%] md:text-5xl xl:text-7xl ">
            {/* Hotel, car & experiences */}
            {t("heroTitle")}
          </h2>
          <span className="text-base text-neutral-500 dark:text-neutral-400 md:text-lg">
            {t("heroDesc")}
          </span>
          <ButtonPrimary
            href={PATH_PAGE.searchBusiness}
            sizeClass="px-5 py-4 sm:px-7"
          >
            {t("startSearch")}
          </ButtonPrimary>
        </div>
        <div className="grow">
          <Image className="w-full" src={imagePng} alt="hero" priority />
        </div>
      </div>

      <div className="z-10 mb-12 hidden w-full lg:-mt-60 lg:mb-0 lg:block">
        <HeroSearchForm />
      </div>
    </div>
  );
};

export default SectionHero;
