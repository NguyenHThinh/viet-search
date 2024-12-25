"use client";

import { Suggestion, SuggestionsContext } from "@/contexts/suggestionContext";
import {
  BuildingOffice2Icon,
  ClockIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDebounce } from "react-use";
import { renderIconTypes } from "../(HeroSearchForm)/(business-search-form)/BusinessSearchForm";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import HighlightWord from "@/shared/HighlightWord";
import { PATH_PAGE } from "@/contains/paths";

interface Props {
  onClick?: () => void;
  onChange?: (value: string) => void;
  setValue?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  headingText?: string;
}

const BusinessInput: FC<Props> = ({
  onChange = () => {},
  setValue = () => {},
  className = "",
  defaultValue = "United States",
  headingText,
}) => {
  const { t, i18n } = useTranslation(["common", "search"]);
  const {
    suggestions,
    recentSuggestions,
    handleSuggestionsWhat,
    handleStoreSuggestions,
    handleDeleteRecentSuggestions,
  } = useContext(SuggestionsContext);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [debouncedValue, setDebouncedValue] = useState("");

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(defaultValue);
    },
    300,
    [defaultValue],
  );

  useEffect(() => {
    handleSuggestionsWhat(debouncedValue);
  }, [debouncedValue, handleSuggestionsWhat]);

  const handleSelectLocation = (item: string) => {
    // DO NOT REMOVE SETTIMEOUT FUNC
    setTimeout(() => {
      setValue(item);
      // onChange && onChange(item);
    }, 0);
  };

  const renderRecentSearch = ({
    heading,
    items,
  }: {
    heading: string;
    items: (string | Suggestion)[];
  }) => {
    return (
      <>
        <p className="block text-base font-semibold">
          {heading || t("search:searchBusiness")}
        </p>
        <div className="mt-3">
          {items.map((item, index) => {
            const isString = typeof item === "string";

            const itemKey = isString ? item : item?.slug ?? index;

            if (!isString) {
              return (
                <div
                  key={itemKey}
                  className="mb-1 flex cursor-pointer items-center space-x-3 py-2 text-base"
                >
                  <ClockIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                  <a
                    href={PATH_PAGE?.business.detail(item?.slug)}
                    onClick={() => handleStoreSuggestions(item)}
                    className="flex flex-1 flex-row items-center gap-2"
                  >
                    <span className="block text-neutral-400">
                      <BuildingOffice2Icon className="h-5 w-5 text-neutral-500 sm:h-6 sm:w-6" />
                    </span>
                    <span className="block text-lg font-medium text-neutral-700 dark:text-neutral-200">
                      <HighlightWord
                        text={item.names?.[i18n.language] || item?.name}
                        highlight={defaultValue}
                        className="line-clamp-1"
                      />
                    </span>
                  </a>
                  <button
                    className="block text-neutral-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecentSuggestions(item);
                    }}
                  >
                    <XMarkIcon className="h-5 w-5 rounded-full transition-all hover:bg-neutral-300 sm:h-6 sm:w-6" />
                  </button>
                </div>
              );
            }

            return (
              <div
                className="mb-1 flex cursor-pointer items-center space-x-3 py-2 text-base"
                onClick={() => handleSelectLocation(item)}
                key={item}
              >
                <ClockIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                <span className="flex-1">{item}</span>
                <button
                  className="block text-neutral-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRecentSuggestions(item);
                  }}
                >
                  <XMarkIcon className="h-5 w-5 rounded-full transition-all hover:bg-neutral-300 sm:h-6 sm:w-6" />
                </button>
              </div>
            );
          })}
          {recentSuggestions?.suggestions?.length < 5 &&
            suggestions
              ?.slice(0, 5 - recentSuggestions?.suggestions?.length)
              ?.map((item, index) => (
                <div
                  className="mb-1 flex cursor-pointer items-center space-x-3 py-2 text-base"
                  onClick={() =>
                    handleSelectLocation(
                      item?.names?.[i18n.language] || item?.name,
                    )
                  }
                  key={index}
                >
                  {renderIconTypes(item?.type)}
                  <span className="flex-1">
                    {item?.names?.[i18n.language] || item?.name}
                  </span>
                </div>
              ))}
        </div>
      </>
    );
  };

  const renderSearchValues = () => {
    const groupedSuggestions: {
      [key: string]: Suggestion[];
    } = {};

    // group suggestions
    suggestions.forEach((item) => {
      const group = item?.type;
      if (!groupedSuggestions[group]) {
        groupedSuggestions[group] = [];
      }
      groupedSuggestions[group].push(item);
    });

    return (
      <>
        {Object.keys(groupedSuggestions).map((group) => (
          <div key={group}>
            {group !== "categories" && (
              <p className="block text-base font-semibold">{group}</p>
            )}
            {groupedSuggestions[group].map((item, index) => (
              <span
                className="mb-1 flex cursor-pointer items-center space-x-3 py-2 text-sm"
                onClick={() =>
                  handleSelectLocation(
                    item.names?.[i18n.language] || item?.name,
                  )
                }
                key={index}
              >
                {renderIconTypes(item?.type)}
                {item?.type === "business" ? (
                  <div>
                    <a
                      href={PATH_PAGE?.business.detail(item?.slug)}
                      onClick={() => handleStoreSuggestions(item)}
                      className="flex flex-row items-center gap-2"
                    >
                      <span>
                        {item?.thumbnail ? (
                          <Image
                            loading="lazy"
                            src={item?.thumbnail}
                            alt=""
                            width={60}
                            height={60}
                          />
                        ) : (
                          <BuildingOffice2Icon className="h-6 w-6 text-neutral-500 sm:h-6 sm:w-6" />
                        )}
                      </span>
                      <span className="block text-lg text-neutral-600 dark:text-neutral-200">
                        <HighlightWord
                          text={item.names?.[i18n.language] || item?.name}
                          highlight={defaultValue}
                          className="line-clamp-2"
                        />
                        <p className="line-clamp-1 text-sm font-normal text-neutral-500 lg:text-sm">
                          {item?.address?.displayed}
                        </p>
                      </span>
                    </a>
                  </div>
                ) : (
                  <span className="block text-lg text-neutral-600 dark:text-neutral-200">
                    <HighlightWord
                      text={item.names?.[i18n.language] || item?.name}
                      highlight={defaultValue}
                    />
                  </span>
                )}
              </span>
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={`${className}`} ref={containerRef}>
      <div className="p-5">
        <span className="block text-xl font-semibold sm:text-2xl">
          {headingText || t("search:searchBusiness")}
        </span>
        <div className="relative mt-5">
          <input
            className="block w-full truncate rounded-xl border border-neutral-900 bg-transparent px-4 py-3 pr-12 text-base font-bold leading-none placeholder:truncate placeholder:text-neutral-500 focus:outline-none focus:ring-0 dark:border-neutral-200 dark:placeholder:text-neutral-300"
            placeholder={t("search:thingToDo")}
            value={defaultValue}
            onChange={(e) => setValue(e.currentTarget.value)}
            ref={inputRef}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-400" />
          </span>
        </div>
        <div className="mt-7">
          {defaultValue
            ? renderSearchValues()
            : recentSuggestions?.suggestions?.length > 0
              ? renderRecentSearch({
                  heading: t("search:recentSearch"),
                  items: recentSuggestions?.suggestions,
                })
              : renderSearchValues()}
        </div>
      </div>
    </div>
  );
};

export default BusinessInput;
