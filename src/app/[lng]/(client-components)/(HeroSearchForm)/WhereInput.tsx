"use client";

import { ClockIcon, MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import React, { useEffect, useRef, useState } from "react";

import ClearDataButton from "./ClearDataButton";
import { useDebounce } from "react-use";
import useSuggestionContext from "@/hooks/useSuggestionContext";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";
import { WhereSuggestion } from "@/contexts/suggestionContext";
import { useTranslation } from "@/app/i18n/client";
import { renderIconTypes } from "./(business-search-form)/BusinessSearchForm";
import HighlightWord from "@/shared/HighlightWord";

export interface WhereInputProps {
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
  value: string;
  setValue: (value: string) => void;
}

const WhereInput: FC<WhereInputProps> = ({
  autoFocus = false,
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
  value,
  setValue,
}) => {
  const { t, i18n } = useTranslation(["common", "search"]);
  const {
    whereSuggestions,
    recentSuggestions,
    handleSuggestionsWhere,
    handleStoreSuggestions,
    handleDeleteRecentSuggestions,
  } = useSuggestionContext();
  const { setFilter } = useBusinessSearchContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showPopover, setShowPopover] = useState(autoFocus);
  const [debouncedValue, setDebouncedValue] = useState("");

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(value);
    },
    300,
    [value],
  );

  useEffect(() => {
    handleSuggestionsWhere(debouncedValue);
  }, [debouncedValue, handleSuggestionsWhere]);

  useEffect(() => {
    setShowPopover(autoFocus);
  }, [autoFocus]);

  useEffect(() => {
    if (eventClickOutsideDiv) {
      document.removeEventListener("click", eventClickOutsideDiv);
    }
    showPopover && document.addEventListener("click", eventClickOutsideDiv);
    return () => {
      document.removeEventListener("click", eventClickOutsideDiv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopover]);

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);

  const eventClickOutsideDiv = (event: MouseEvent) => {
    if (!containerRef.current) return;
    // CLICK IN_SIDE
    if (!showPopover || containerRef.current.contains(event.target as Node)) {
      return;
    }
    // CLICK OUT_SIDE
    setShowPopover(false);
  };

  const handleSelectLocation = (item: string) => {
    setValue(item);
    setShowPopover(false);
  };

  useEffect(() => {
    !recentSuggestions?.whereSuggestions?.length && handleSuggestionsWhere("");
  }, [handleSuggestionsWhere, recentSuggestions?.whereSuggestions]);

  const renderRecentSearches = () => {
    return (
      <>
        <h3 className="mt-2 block px-4 text-base font-semibold text-neutral-800 dark:text-neutral-100 sm:mt-0 sm:px-8 sm:text-lg">
          {t("search:recentSearch")}
        </h3>
        <div className="mt-2">
          {recentSuggestions?.whereSuggestions.slice(0, 5).map((item) => (
            <span
              onClick={() => handleSelectLocation(item)}
              key={item}
              className="flex cursor-pointer items-center space-x-3 p-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 sm:space-x-4 sm:px-8"
            >
              <span className="block text-neutral-400">
                <ClockIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              </span>
              <span className=" block flex-1 font-medium text-neutral-700 dark:text-neutral-200">
                <HighlightWord text={item} highlight={value} />
              </span>
              <button
                className="block text-neutral-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRecentSuggestions(item, true);
                }}
              >
                <XMarkIcon className="h-4 w-4 rounded-full transition-all hover:bg-neutral-300 sm:h-6 sm:w-6" />
              </button>
            </span>
          ))}
          {recentSuggestions?.whereSuggestions?.length < 5 &&
            whereSuggestions
              ?.slice(0, 5 - recentSuggestions?.whereSuggestions?.length)
              ?.map((item, index) => (
                <span
                  onClick={() =>
                    handleSelectLocation(
                      item?.names?.[i18n.language] || item?.name,
                    )
                  }
                  key={index}
                  className="flex cursor-pointer items-center space-x-3 p-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 sm:space-x-4 sm:px-8"
                >
                  {renderIconTypes(item?.type)}
                  <span className=" block flex-1 font-medium text-neutral-700 dark:text-neutral-200">
                    <HighlightWord
                      text={item?.names?.[i18n.language] || item?.name}
                      highlight={value}
                    />
                  </span>
                </span>
              ))}
        </div>
      </>
    );
  };

  const renderSearchValue = () => {
    const groupedSuggestions: {
      [key: string]: WhereSuggestion[];
    } = {};

    // group suggestions
    whereSuggestions.forEach((item) => {
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
              <h3 className="mt-2 block px-4 text-base font-semibold text-neutral-800 dark:text-neutral-100 sm:mt-0 sm:px-8 sm:text-lg">
                {t(`common:${group}`, { defaultValue: "" })}
              </h3>
            )}
            {groupedSuggestions[group].map((item, index) => (
              <span
                onClick={() =>
                  handleSelectLocation(
                    item.names?.[i18n.language] || item?.name,
                  )
                }
                key={index}
                className="flex cursor-pointer items-center space-x-3 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 sm:space-x-4 sm:px-8"
              >
                {renderIconTypes(item?.type)}
                <span className="block text-lg font-medium text-neutral-700 dark:text-neutral-200">
                  <HighlightWord
                    text={item.names?.[i18n.language] || item?.name}
                    highlight={value}
                  />
                </span>
              </span>
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`[ nc-hero-field-padding ] relative z-10 flex flex-1 shrink-0 cursor-pointer items-center space-x-3 text-left focus:outline-none  
        ${showPopover ? "nc-hero-field-focused" : ""}`}
      >
        <div className="text-neutral-300 dark:text-neutral-400">
          <MapPinIcon className="h-5 w-5 lg:h-7 lg:w-7" />
        </div>
        <div className="grow">
          <input
            className="block w-full truncate border-none bg-transparent p-0 font-semibold placeholder:text-neutral-800 focus:outline-none focus:ring-0 focus:placeholder:text-neutral-300 dark:placeholder:text-neutral-200 xl:text-lg"
            placeholder={t("common:location")}
            value={value}
            autoFocus={showPopover}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!value) return;
                handleStoreSuggestions(value, true);
                setFilter({ where: value });
                return;
              }
            }}
            onChange={(e) => {
              setValue(e.currentTarget.value);
            }}
            ref={inputRef}
          />
          <span className="mt-0.5 block text-sm font-light text-neutral-400 ">
            <span className="line-clamp-1">
              {value ? t("common:location") : t("search:locationInfo")}
            </span>
          </span>
          {value && showPopover && (
            <ClearDataButton
              onClick={() => {
                setValue("");
              }}
            />
          )}
        </div>
      </div>

      {showPopover && (
        <div
          className={`absolute top-1/2 z-0 h-8 -translate-y-1/2 self-center bg-white dark:bg-neutral-800 ${divHideVerticalLineClass}`}
        />
      )}

      {showPopover &&
        (value ? (
          whereSuggestions?.length > 0 && (
            <div className="absolute left-0 top-full z-40 mt-3 max-h-96 w-full min-w-[300px] max-w-[600px] overflow-y-auto overscroll-contain rounded-3xl bg-white py-3 shadow-xl dark:bg-neutral-800 sm:min-w-[600px] sm:py-6">
              {renderSearchValue()}
            </div>
          )
        ) : recentSuggestions?.whereSuggestions?.length > 0 ? (
          <div className="absolute left-0 top-full z-40 mt-3 max-h-96 w-full min-w-[300px] max-w-[600px] overflow-y-auto overscroll-contain rounded-3xl bg-white py-3 shadow-xl dark:bg-neutral-800 sm:min-w-[500px] sm:py-6">
            {renderRecentSearches()}
          </div>
        ) : (
          <div className="absolute left-0 top-full z-40 mt-3 max-h-96 w-full min-w-[300px] max-w-[600px] overflow-y-auto overscroll-contain rounded-3xl bg-white py-3 shadow-xl dark:bg-neutral-800 sm:min-w-[500px] sm:py-6">
            {renderSearchValue()}
          </div>
        ))}
    </div>
  );
};

export default WhereInput;
