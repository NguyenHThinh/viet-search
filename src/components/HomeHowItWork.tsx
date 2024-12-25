import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import React from "react";

import HIW1img from "@/images/HIW1.png";
import HIW2img from "@/images/HIW2.png";
import HIW3img from "@/images/HIW3.png";
import VectorImg from "@/images/VectorHIW.svg";
import Heading from "@/shared/Heading";
import { TFunction } from "i18next";

export interface HomeHowItWorkProps {
  className?: string;
  heading?: string;
  desc?: string;
  data?: {
    id: number;
    title: string;
    desc: string;
    img: StaticImageData;
    imgDark?: StaticImageData;
  }[];
  t: TFunction;
}

const HomeHowItWork: FC<HomeHowItWorkProps> = ({
  className = "",
  heading,
  desc,
  data,
  t,
}) => {
  const DEMO_DATA: HomeHowItWorkProps["data"] = data ?? [
    {
      id: 1,
      img: HIW1img,
      title: t("bookRelax"),
      desc: t("eachTrip"),
    },
    {
      id: 2,
      img: HIW2img,
      title: t("smartChecklist"),
      desc: t("eachTrip"),
    },
    {
      id: 3,
      img: HIW3img,
      title: t("saveMore"),
      desc: t("eachTrip"),
    },
  ];
  return (
    <div className={`nc-HomeHowItWork ${className}`} data-nc-id="HomeHowItWork">
      <Heading isCenter desc={desc ?? t("keepCalm")}>
        {heading ?? t("howItWork")}
      </Heading>
      <div className="relative mt-20 grid gap-20 md:grid-cols-3">
        <Image
          className="absolute inset-x-0 top-10 hidden md:block"
          src={VectorImg}
          alt=""
        />
        {DEMO_DATA.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="relative mx-auto flex max-w-xs flex-col items-center"
          >
            {item.imgDark ? (
              <>
                <Image
                  loading="lazy"
                  className="mx-auto mb-8 block max-w-[180px] dark:hidden"
                  src={item.img}
                  alt=""
                />
                <Image
                  alt=""
                  loading="lazy"
                  className="mx-auto mb-8 hidden max-w-[180px] dark:block"
                  src={item.imgDark}
                />
              </>
            ) : (
              <Image
                alt=""
                loading="lazy"
                className="mx-auto mb-8 max-w-[180px]"
                src={item.img}
              />
            )}
            <div className="mt-auto text-center">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <span className="mt-5 block text-neutral-500 dark:text-neutral-400">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeHowItWork;
