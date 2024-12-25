import Image from "next/image";
import type { FC } from "react";
import React from "react";

import rightImgDemo from "@/images/BecomeAnAuthorImg.png";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Logo from "@/shared/Logo";
import { TFunction } from "i18next";

export interface SectionBecomeAnAuthorProps {
  className?: string;
  rightImg?: string;
  t: TFunction;
}

const SectionBecomeAnAuthor: FC<SectionBecomeAnAuthorProps> = ({
  className = "",
  rightImg = rightImgDemo,
  t,
}) => {
  return (
    <div
      className={`nc-SectionBecomeAnAuthor relative flex flex-col items-center lg:flex-row  ${className}`}
      data-nc-id="SectionBecomeAnAuthor"
    >
      <div className="mb-16 shrink-0 lg:mb-0 lg:mr-10 lg:w-2/5">
        <Logo className="w-40" />
        <h2 className="mt-6 text-3xl font-semibold sm:mt-11 sm:text-4xl">
          {t("whyChooseUs")}
        </h2>
        <span className="mt-6 block text-neutral-500 dark:text-neutral-400">
          {t("accompanyingUs")}
        </span>
        <ButtonPrimary className="mt-6 sm:mt-11">
          {t("becomeAnAuthor")}
        </ButtonPrimary>
      </div>
      <div className="grow">
        <Image alt="" src={rightImg} />
      </div>
    </div>
  );
};

export default SectionBecomeAnAuthor;
