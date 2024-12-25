"use client";

import React, { FC, useEffect, useState } from "react";
import { StayDataType } from "@/data/types";
import BusinessPagination from "@/shared/BusinessPagination";
import TabFilters from "./TabFilters";
import Heading2 from "@/shared/Heading2";
import BusinessCard2 from "@/components/BusinessCard2";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";
import { filterKey } from "@/contains/business";
import { useTranslation } from "@/app/i18n/client";

export interface SectionGridFilterCardProps {
  className?: string;
  data?: StayDataType[];
}

interface FilterTag {
  value: string;
  type: string;
}

const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
}) => {
  const { i18n } = useTranslation("common");
  const { result, total, searchParams } = useBusinessSearchContext();

  const [arrFilterTag, setArrFiterTag] = useState<FilterTag[]>([]);

  const handleSetFilterTag = (
    newTag: { value: string; type: string },
    removeFilter?: boolean,
  ) => {
    if (removeFilter) {
      const updatedFilterTags = arrFilterTag.filter(
        (tag) => tag.value !== newTag.value || tag.type !== newTag.type,
      );
      setArrFiterTag(updatedFilterTags);
    } else {
      setArrFiterTag([...arrFilterTag, newTag]);
    }
  };

  useEffect(() => {
    const getShowFilterTag = (): FilterTag[] => {
      return filterKey.reduce<FilterTag[]>((acc, key) => {
        const values = searchParams?.[key]?.split(",") ?? [];
        const taggedValues = values
          .filter((value) => value.trim() !== "")
          .map((value) => ({
            value,
            type: key,
          }));
        return acc.concat(taggedValues);
      }, []);
    };

    const arrFilter = getShowFilterTag();
    setArrFiterTag(arrFilter);
  }, []);

  return (
    <div
      className={`nc-SectionGridFilterCard ${className}`}
      data-nc-id="SectionGridFilterCard"
    >
      <Heading2
        subHeading={
          <span className="mt-3 block text-neutral-500 dark:text-neutral-400">
            {`${total?.value ?? 0} result`}
          </span>
        }
      />

      <div className="mb-8 lg:mb-11">
        <TabFilters
          arrFilterTag={arrFilterTag}
          setArrFiterTag={handleSetFilterTag}
          setMoreFiterTag={setArrFiterTag}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {result.map((stay) => (
          <BusinessCard2 key={stay.id} data={stay} lng={i18n.language} />
        ))}
      </div>
      <div className="mt-16 flex items-center justify-center">
        <BusinessPagination />
      </div>
    </div>
  );
};

export default SectionGridFilterCard;
