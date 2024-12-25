"use client";

import { useTranslation } from "@/app/i18n/client";
import { filterKey } from "@/contains/business";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";
import { iCategory, iCountryCode } from "@/models/iFacets";

const ShowFilter = ({
  arrFilterTag,
  arrFacets,
  setArrFiterTag,
  setMoreFiterTag,
}: {
  arrFilterTag: { value: string; type: string }[];
  arrFacets: (iCategory | iCountryCode)[];
  setArrFiterTag: (
    newTag: { value: string; type: string },
    removeFilter?: boolean,
  ) => void;
  setMoreFiterTag: (newTag: { value: string; type: string }[]) => void;
}) => {
  const { t, i18n } = useTranslation(["common"]);
  const { searchParams, setFilter } = useBusinessSearchContext();

  const refactorArrFilterTag = () => {
    return arrFilterTag.map((item) => {
      const found = arrFacets.find((i) => i?.key === item.value.toLowerCase());
      return found
        ? {
            value: found.names?.[i18n.language],
            type: item.type,
            key: item.value,
          }
        : { ...item, key: item.value };
    });
  };

  const clearAllFilter = () => {
    const filterCleaned = filterKey.reduce<Record<string, string>>(
      (acc, curr) => {
        acc[curr] = "";
        return acc;
      },
      {},
    );

    const handleResetFilter = () => {
      setMoreFiterTag([]);
      setFilter(filterCleaned);
    };

    return (
      <button
        onClick={handleResetFilter}
        className={`flex items-center justify-center rounded-full border border-red-700 bg-red-700 px-4 py-2 text-sm text-white hover:bg-red-400 focus:outline-none dark:border-neutral-700 dark:hover:border-neutral-6000`}
      >
        <span>{t("common:clearAll")}</span>
      </button>
    );
  };

  const renderFilter = ({
    value,
    type,
    key,
  }: {
    value: string;
    type: string;
    key: string;
  }) => {
    const handleDeleteFilter = () => {
      if (!searchParams?.[type]) return;

      const newarrFilterTag = searchParams?.[type].split(",");

      //map arrFilterTag to type string[]
      const updatedFilter = {
        [type]: newarrFilterTag.filter((item) => item !== key).join(",") ?? "",
      };

      setArrFiterTag({ value: key, type }, true);
      setFilter(updatedFilter);
    };

    return (
      <div className="flex cursor-default flex-row items-center rounded-full border border-primary-500 bg-primary-50 px-4 py-2 text-sm text-primary-700">
        {value}
        <span
          className="ml-3 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-primary-700 text-white"
          onClick={handleDeleteFilter}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 scale-90"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    );
  };

  if (!arrFilterTag.length) return <></>;

  return (
    <div className="flex flex-wrap gap-3">
      {refactorArrFilterTag().map((item, index) => {
        return item && <div key={index}>{renderFilter(item)}</div>;
      })}
      {arrFilterTag?.length > 0 && clearAllFilter()}
    </div>
  );
};

export default ShowFilter;
