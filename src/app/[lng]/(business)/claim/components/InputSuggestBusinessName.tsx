"use client";

import {
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import type { FC } from "react";
import React, { useEffect, useRef, useState } from "react";

import { useDebounce } from "react-use";
import { Suggestion } from "@/contexts/suggestionContext";
import { useTranslation } from "@/app/i18n/client";
import HighlightWord from "@/shared/HighlightWord";
import { PATH_CLAIM, PATH_PAGE } from "@/contains/paths";
import AppImageWithLoading from "@/components/AppImageWithLoading";
import { getSuggestionWhat } from "@/services/search";
import Link from "next/link";
import { renderIconTypes } from "@/app/[lng]/(client-components)/(HeroSearchForm)/(business-search-form)/BusinessSearchForm";
import ClearDataButton from "@/app/[lng]/(client-components)/(HeroSearchForm)/ClearDataButton";

export interface InputSuggestBusinessNameProps {
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
}

const InputSuggestBusinessName: FC<InputSuggestBusinessNameProps> = ({
  autoFocus = false,
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
}) => {
  const { t, i18n } = useTranslation(["claim", "common"]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [suggestionsResult, setSuggestionsResult] = useState<Suggestion[]>([]);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const [showPopover, setShowPopover] = useState(autoFocus);

  const getSuggestionsBusinessName = async (value: string) => {
    try {
      const searchParams = {
        q: value,
        size: 10,
        lang: i18n.language,
        claimFilter: "unclaimed",
      };
      const items = await getSuggestionWhat(searchParams);
      setSuggestionsResult(items);
    } catch (e) {
      console.error("Has wrong with fetch suggetions: ", e);
      setSuggestionsResult([]);
    }
  };

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(value);
    },
    300,
    [value],
  );

  useEffect(() => {
    getSuggestionsBusinessName(debouncedValue);
  }, [debouncedValue]);

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

  const handleSelectItem = (item: string) => {
    setValue(item);
    setShowPopover(false);
  };

  const renderSearchValue = () => {
    return (
      <div>
        {suggestionsResult.map((item, index) => (
          <span
            onClick={() =>
              handleSelectItem(item.names?.[i18n.language] || item?.name)
            }
            key={index}
            className="flex cursor-pointer items-center space-x-3 rounded-lg px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 sm:space-x-4"
          >
            {renderIconTypes(item?.type)}
            {item?.type === "business" ? (
              <div>
                <Link
                  href={PATH_CLAIM.claimOptions(item?.slug)}
                  className="flex flex-row items-center gap-2"
                >
                  <span>
                    {item?.thumbnail ? (
                      <AppImageWithLoading
                        src={item?.thumbnail}
                        alt=""
                        width={60}
                        height={60}
                      />
                    ) : (
                      <BuildingOffice2Icon className="h-5 w-5 text-neutral-500 sm:h-6 sm:w-6" />
                    )}
                  </span>
                  <span className="block text-lg font-medium text-neutral-700 dark:text-neutral-200">
                    <HighlightWord
                      text={item.names?.[i18n.language] || item?.name}
                      highlight={value}
                      className="line-clamp-1"
                    />
                    <p className="line-clamp-1 text-base font-normal text-neutral-500 lg:text-sm">
                      {item?.address?.displayed}
                    </p>
                  </span>
                </Link>
              </div>
            ) : (
              <span className="block text-lg font-medium text-neutral-700 dark:text-neutral-200">
                <HighlightWord
                  text={item.names?.[i18n.language] || item?.name}
                  highlight={value}
                />
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`[ nc-hero-field-padding ] !lg:px-7 !lg:py-4 relative z-10 flex flex-1 shrink-0 cursor-pointer items-center space-x-3 rounded-3xl border text-left shadow-md focus:outline-none
        ${showPopover ? "nc-hero-field-focused" : ""}`}
      >
        <div className="grow">
          <input
            className="block w-full truncate border-none bg-transparent p-0 font-semibold ring-0 placeholder:text-neutral-800 focus:outline-none focus:placeholder:text-neutral-300 dark:placeholder:text-neutral-200 xl:text-lg"
            placeholder={t("claim:yourBusinessName")}
            value={value}
            autoFocus={showPopover}
            onChange={(e) => {
              setValue(e.currentTarget.value);
            }}
            autoComplete="false"
            ref={inputRef}
          />
          {value && showPopover ? (
            <ClearDataButton
              onClick={() => {
                setValue("");
              }}
            />
          ) : (
            <span className="absolute right-3 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-sm dark:bg-neutral-800 lg:h-6 lg:w-6">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </span>
          )}
        </div>
      </div>

      {showPopover && (
        <div
          className={`absolute top-1/2 z-0 h-8 -translate-y-1/2 self-center bg-white dark:bg-neutral-800 ${divHideVerticalLineClass}`}
        />
      )}

      {showPopover && (
        <div className="absolute left-0 top-full z-40 mt-3 max-h-96 w-full min-w-[300px] max-w-[600px] overflow-y-auto overscroll-contain rounded-3xl bg-white shadow-xl dark:bg-neutral-800 sm:min-w-[600px] sm:px-2 sm:py-4">
          {value && (
            <div>
              <Link
                href={PATH_PAGE.addBusinessWithName(value)}
                className="flex cursor-pointer items-center space-x-3 rounded-lg px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 sm:space-x-4 "
              >
                <span>
                  <BuildingStorefrontIcon className="h-8 w-8 text-neutral-500 " />
                </span>
                <span className="block text-lg font-medium text-neutral-700 dark:text-neutral-200">
                  <p className="line-clamp-1">{value}</p>
                  <p className="line-clamp-1 text-base font-normal text-neutral-500 lg:text-sm">
                    {t("claim:addWithThisName")}
                  </p>
                </span>
              </Link>
            </div>
          )}
          {renderSearchValue()}
        </div>
      )}
    </div>
  );
};

export default InputSuggestBusinessName;
