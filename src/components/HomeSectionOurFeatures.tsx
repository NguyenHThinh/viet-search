import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import React from "react";

import rightImgPng from "@/images/our-features.png";
import Badge from "@/shared/Badge";
import { TFunction } from "i18next";
import NextImage from "@/components/NextImage";
import AppImageWithLoading from "@/components/AppImageWithLoading";

export interface SectionOurFeaturesProps {
  className?: string;
  rightImg?: StaticImageData;
  type?: "type1" | "type2";
  t: TFunction;
}

const HomeSectionOurFeatures: FC<SectionOurFeaturesProps> = ({
  className = "lg:py-14",
  rightImg = {
    src: "https://s3.amazonaws.com/static.vietsearch.org/images/home/feature-service.png",
    width: 915,
    height: 652,
  },
  type = "type1",
  t,
}) => {
  return (
    <div
      className={`nc-SectionOurFeatures relative flex flex-col items-center ${
        type === "type1" ? "lg:flex-row" : "lg:flex-row-reverse"
      } ${className}`}
      data-nc-id="SectionOurFeatures"
    >
      <div className="grow">
        <AppImageWithLoading
          src={rightImg.src}
          width={rightImg.width}
          height={rightImg.height}
          alt=""
          quality={70}
        />
      </div>
      <div
        className={`mt-10 max-w-2xl shrink-0 lg:mt-0 lg:w-2/5 ${
          type === "type1" ? "lg:pl-16" : "lg:pr-16"
        }`}
      >
        <span className="text-sm uppercase tracking-widest text-gray-400">
          {t("countBusiness")}
        </span>
        <h2 className="mt-5 text-4xl font-semibold">
          {t("searchBusinessFree")}
        </h2>

        <ul className="mt-16 space-y-10">
          <li className="space-y-4">
            <Badge name={t("userFriendly")} color="green" />
            <span className="block text-xl font-semibold">
              {t("simpleUse")}
            </span>
            <span className="mt-5 block text-neutral-500 dark:text-neutral-400">
              {t("simpleUseDesc")}
            </span>
          </li>
          <li className="space-y-4">
            <Badge name={t("globalization")} />
            <span className="block text-xl font-semibold">
              {t("reachGlobalCustomer")}
            </span>
            <span className="mt-5 block text-neutral-500 dark:text-neutral-400">
              {t("reachGlobalCustomerDesc")}
            </span>
          </li>
          <li className="space-y-4">
            <Badge color="red" name={t("support")} />
            <span className="block text-xl font-semibold">
              {t("abroadServices")}
            </span>
            <span className="mt-5 block text-neutral-500 dark:text-neutral-400">
              {t("abroadServicesDesc")}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomeSectionOurFeatures;
