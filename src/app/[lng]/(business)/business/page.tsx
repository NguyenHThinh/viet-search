import { useTranslation } from "@/app/i18n";
import React from "react";
import { PATH_CLAIM, PATH_PAGE } from "@/contains/paths";

import HIW1img from "@/images/HIW2-1.png";
import HIW2img from "@/images/HIW2-2.png";
import HIW3img from "@/images/HIW2-3.png";
import rightImgPng from "@/images/our-features-2.png";
import adsImage from "@/images/ads.png";
import Image from "next/image";
import BackgroundSection from "@/components/BackgroundSection";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { MegaphoneIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import SectionClientSay from "@/components/SectionClientSay";
import SectionSliderRightImg from "@/components/SectionSliderRightImg";

const BusinessLandingPage = async ({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) => {
  const { t } = await useTranslation(lng, ["homepage", "businessPage"]);

  // section hero
  const renderHeroSection = () => {
    return (
      <div
        className="nc-SectionOurFeatures relative flex flex-col items-center gap-6 text-center lg:flex-row lg:gap-0 lg:text-left"
        data-nc-id="SectionOurFeatures"
      >
        <div className="max-w-2xl shrink-0 space-y-6 lg:mt-0 lg:w-1/2 lg:pb-10 lg:pr-16">
          <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            {t("businessPage:standOutOnVS")}
          </h2>
          <p className="text-base tracking-widest text-neutral-700 dark:text-neutral-400 md:text-lg">
            {t("businessPage:turnPeopleFind")}
          </p>
          <ButtonPrimary href={PATH_CLAIM.searchClaim}>
            {t("businessPage:manageNow")}
          </ButtonPrimary>
        </div>
        <div className="grow">
          <Image src={rightImgPng} alt="" />
        </div>
      </div>
    );
  };

  // section 2
  const renderSection2 = () => {
    const DEMO_DATA = [
      {
        id: 1,
        img: HIW3img,
        title: t("businessPage:free"),
        desc: t("businessPage:createNoCost"),
      },
      {
        id: 2,
        img: HIW2img,
        title: t("businessPage:easy"),
        desc: t("businessPage:manageBusinessEasy"),
      },
      {
        id: 3,
        img: HIW1img,
        title: t("businessPage:personalized"),
        desc: t("businessPage:addMoreInfo"),
      },
    ];

    return (
      <>
        <div className="relative grid gap-20 md:grid-cols-3">
          {DEMO_DATA.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="relative mx-auto flex max-w-xs flex-col items-center"
            >
              <Image
                alt=""
                loading="lazy"
                className="mx-auto mb-2 max-w-[180px] md:mb-8"
                src={item.img}
              />
              <div className="text-center">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <span className="mt-2 block text-neutral-500 dark:text-neutral-400 md:mt-5">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonPrimary href={PATH_CLAIM.searchClaim}>
            {t("businessPage:manageNow")}
          </ButtonPrimary>
        </div>
      </>
    );
  };

  // section 3
  const renderSection3 = () => {
    const DEMO_DATA = [
      {
        id: 1,
        title: t("businessPage:claim"),
        desc: t("businessPage:createBusinessProfile"),
      },
      {
        id: 2,
        title: t("businessPage:personalized"),
        desc: t("businessPage:addMoreInfo"),
      },
      {
        id: 3,
        title: t("businessPage:manage"),
        desc: t("businessPage:shareUpdatereview"),
      },
    ];

    return (
      <>
        <div className="relative mx-auto space-y-6 pb-20 text-center lg:w-4/5">
          <h3 className="text-3xl font-medium md:text-4xl">
            {t("businessPage:showBestYourBusiness")}
          </h3>
          <p className="text-neutral-800 dark:text-neutral-100">
            {t("businessPage:reachMore")}
          </p>
          <ButtonPrimary href={PATH_CLAIM.searchClaim}>
            {t("businessPage:manageNow")}
          </ButtonPrimary>
        </div>
        <div className="relative grid gap-14 md:grid-cols-3 md:gap-20">
          {DEMO_DATA.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="relative mx-auto flex max-w-xs flex-col items-center space-y-6"
            >
              <div className="flex aspect-1 w-24 items-center justify-center rounded-full bg-white">
                <h2 className="text-4xl font-bold text-[#1D73DE]">{item.id}</h2>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  // section ads
  const sectionAds = () => {
    return (
      <div>
        <div className="relative mx-auto mb-10 space-y-6 text-center lg:w-2/3">
          <div className="mx-auto w-max rounded-full border p-4 shadow-md">
            <MegaphoneIcon className="aspect-1 w-10 -rotate-12" />
          </div>
          <h3 className="text-lg font-bold md:text-xl">
            {t("businessPage:VSAds")}
          </h3>
          <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
            {t("businessPage:businessWithVSAds")}
          </h2>
        </div>
        <div
          className="nc-SectionOurFeatures relative flex flex-col items-center gap-6 lg:flex-row lg:gap-0"
          data-nc-id="SectionOurFeatures"
        >
          <div className="mt-10 max-w-2xl shrink-0 space-y-6 lg:mt-0 lg:w-1/2 lg:py-10 lg:pr-16">
            <div className="space-y-6 lg:w-4/5">
              <p className="text-base text-neutral-600 dark:text-neutral-100 lg:text-lg">
                {t("businessPage:reachMoreCustomer")}
              </p>
              <ul className="w-4/5 space-y-5">
                <li className="flex flex-row">
                  <CheckIcon className="mr-3 h-5 w-5 min-w-max translate-y-1 text-primary-700" />
                  <p className="text-base text-neutral-600 dark:text-neutral-100 lg:text-lg">
                    {t("businessPage:prominentDisplay")}
                  </p>
                </li>
                <li className="flex flex-row">
                  <CheckIcon className="mr-3 h-5 w-5 min-w-max translate-y-1 text-primary-700" />
                  <p className="text-base text-neutral-600 dark:text-neutral-100 lg:text-lg">
                    {t("businessPage:onlyPay")}
                  </p>
                </li>
                <li className="flex flex-row">
                  <CheckIcon className="mr-3 h-5 w-5 min-w-max translate-y-1 text-primary-700" />
                  <p className="text-base text-neutral-600 dark:text-neutral-100 lg:text-lg">
                    {t("businessPage:cancelAnytime")}
                  </p>
                </li>
              </ul>
              <ButtonPrimary href={PATH_CLAIM.searchClaim} className="mt-2">
                {t("businessPage:manageNow")}
              </ButtonPrimary>
            </div>
          </div>
          <div className="grow">
            <Image src={adsImage} alt="" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container relative mb-24 mt-12 space-y-20">
      {renderHeroSection()}
      <div className="">
        <div className="my-20 space-y-5 text-center">
          <h2 className="text-4xl font-medium">
            {t("businessPage:takeFirstImpression")}
          </h2>
          <p>{t("businessPage:highlightEssentialInfo")}</p>
          <ButtonPrimary href={PATH_PAGE.addBusiness}>
            {t("businessPage:manageNow")}
          </ButtonPrimary>
        </div>
        <SectionSliderRightImg />
      </div>
      <div className="relative py-20">
        <BackgroundSection className="bg-[#e8f0fe]" />
        {renderSection3()}
      </div>
      {sectionAds()}
      <div className="relative py-16">
        <BackgroundSection />
        {renderSection2()}
      </div>
      <div className="relative py-16">
        <BackgroundSection />
        <SectionClientSay />
      </div>
    </div>
  );
};

export default BusinessLandingPage;
