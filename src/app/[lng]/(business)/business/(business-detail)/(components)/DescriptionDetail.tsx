"use client";

import { useTranslation } from "@/app/i18n/client";
import { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import Button from "@/shared/Button";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export interface IDescriptionDetailProps {
  description: string;
  title: string;
}

export function DescriptionDetail(props: IDescriptionDetailProps) {
  const { t } = useTranslation(["common"]);
  // ref
  const descriptionRef = useRef<HTMLDivElement>(null);

  // state
  const [isShowAll, setIsShowAll] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const handleChangeDesc = () => {
    setIsShowAll((prev) => !prev);
    if (isShowAll && descriptionRef.current) {
      descriptionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // check content overflow height
  useEffect(() => {
    const element = descriptionRef.current;
    if (element) {
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [props.description]);

  return (
    <div className="listingSection__wrap">
      <h2 className="text-2xl font-semibold">{props.title}</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div
        className={`relative overflow-hidden text-neutral-6000 dark:text-neutral-300 ${isShowAll ? "h-full" : "max-h-80"}`}
        ref={descriptionRef}
      >
        {parse(props.description)}
        {!isShowAll && isOverflowing && (
          <div className="absolute bottom-0 h-5 w-full bg-gradient-to-t from-neutral-50 to-transparent"></div>
        )}
      </div>
      {isOverflowing && (
        <Button
          className="mx-auto w-max rounded-lg border hover:underline"
          onClick={handleChangeDesc}
        >
          {isShowAll ? t("common:hidden") : t("common:seeAll")}
          {isShowAll ? (
            <ChevronUpIcon className="ml-1 h-5 w-5" />
          ) : (
            <ChevronDownIcon className="ml-1 h-5 w-5" />
          )}
        </Button>
      )}
    </div>
  );
}
