import Image from "next/image";
import type { FC } from "react";
import React from "react";

import rightImg from "@/images/SVG-subcribe2.png";
import Badge from "@/shared/Badge";
import ButtonCircle from "@/shared/ButtonCircle";
import Input from "@/shared/Input";
import { TFunction } from "i18next";

export interface HomeSubscribe2Props {
  className?: string;
  t: TFunction;
}

const HomeSubscribe2: FC<HomeSubscribe2Props> = ({ className = "", t }) => {
  return (
    <div
      className={`nc-SectionSubscribe2 relative flex flex-col lg:flex-row lg:items-center ${className}`}
      data-nc-id="SectionSubscribe2"
    >
      <div className="mb-10 shrink-0 lg:mb-0 lg:mr-10 lg:w-2/5">
        <h2 className="text-4xl font-semibold">{t("joinOutNewLetter")} 🎉</h2>
        <span className="mt-5 block text-neutral-500 dark:text-neutral-400">
          {t("readAndShare")}
        </span>
        <ul className="mt-10 space-y-4">
          <li className="flex items-center space-x-4">
            <Badge name="01" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {t("getDiscount")}
            </span>
          </li>
          <li className="flex items-center space-x-4">
            <Badge color="red" name="02" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {t("getMagazines")}
            </span>
          </li>
        </ul>
        <form className="relative mt-10 max-w-sm">
          <Input
            required
            aria-required
            placeholder={t("enterEmail")}
            type="email"
            rounded="rounded-full"
            sizeClass="h-12 px-5 py-3"
          />
          <ButtonCircle
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
            size="w-10 h-10"
          >
            <i className="las la-arrow-right text-xl" />
          </ButtonCircle>
        </form>
      </div>
      <div className="grow">
        <Image alt="" src={rightImg} />
      </div>
    </div>
  );
};

export default HomeSubscribe2;
