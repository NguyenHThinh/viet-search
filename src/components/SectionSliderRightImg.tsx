"use client";

import Image from "next/image";
import defaultImgPng from "@/images/contact-hero-right.png";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { PATH_PAGE } from "@/contains/paths";

export interface SlideData {
  title: string;
  desc: string;
  img: string;
}

const SectionSliderRightImg = ({
  sliderData,
}: {
  sliderData?: SlideData[];
}) => {
  const { t } = useTranslation(["businessPage"]);
  const [currSlide, setCurrSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const EXAM_DATA = sliderData ?? [
    {
      title: t("businessPage:addInfo"),
      desc: t("businessPage:addInfoLike"),
      img: defaultImgPng,
    },
    {
      title: t("businessPage:shareImage"),
      desc: t("businessPage:introduceYourBusiness"),
      img: defaultImgPng,
    },
    {
      title: t("businessPage:showPeopleAboutYourBusiness"),
      desc: t("businessPage:addUniqueAttribute"),
      img: defaultImgPng,
    },
  ];

  // handle auto change slide
  useEffect(() => {
    setIsAnimating(true); // Start the animation

    const slideInterval = setInterval(() => {
      setCurrSlide((prev) => (prev < EXAM_DATA.length - 1 ? prev + 1 : 0));
    }, 10000); // 10 seconds

    return () => clearInterval(slideInterval); // Clean when unmount
  }, [currSlide]);

  return (
    <div
      className="nc-SectionOurFeatures animat relative flex flex-col items-center gap-14 lg:flex-row lg:gap-6"
      data-nc-id="SectionOurFeatures"
    >
      <div className="grow md:px-20">
        <Image src={EXAM_DATA[currSlide]?.img ?? defaultImgPng} alt="" />
      </div>
      <div className="max-w-2xl shrink-0 space-y-6 lg:mt-0 lg:w-1/2 lg:pb-10 lg:pr-16">
        {EXAM_DATA.slice(0, 3).map((item, index) => (
          <div className="flex flex-row gap-7" key={index}>
            <div className="line relative w-0.5 shrink-0 bg-neutral-300 dark:bg-neutral-500">
              <div
                className={`absolute left-0 top-0 h-0 w-full bg-black transition-all ease-linear dark:bg-neutral-200 ${
                  currSlide === index && isAnimating
                    ? "h-full duration-10000"
                    : ""
                }`}
              ></div>
            </div>
            <div
              className={`${currSlide === index ? "" : "text-neutral-6000 hover:text-neutral-900 dark:hover:text-neutral-200"} space-y-4`}
            >
              <p
                className={`${currSlide === index ? "text-2xl font-medium md:text-3xl" : "text-xl"} cursor-pointer`}
                onClick={() => setCurrSlide(index)}
              >
                {item.title}
              </p>
              <p className={currSlide !== index ? "hidden" : ""}>{item.desc}</p>
            </div>
          </div>
        ))}
        <ButtonPrimary href={PATH_PAGE.addBusiness}>
          {t("businessPage:manageNow")}
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default SectionSliderRightImg;
