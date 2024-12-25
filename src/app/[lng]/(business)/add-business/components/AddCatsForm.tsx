/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import FormItem from "./FormItem";
import { useDebounce } from "react-use";
import { iCategory } from "@/models/iFacets";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/app/i18n/client";
import { suggestionCategories } from "@/services/business";
import Badge from "@/shared/Badge";
import { APP_CONFIGS } from "@/config-global";
import _ from "lodash";

const AddCatsForm = ({
  hasLabel = true,
  defaultValue,
}: {
  hasLabel?: boolean;
  defaultValue?: string[];
}) => {
  //
  const { t, i18n } = useTranslation(["addBusiness"]);
  //
  const {
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const [categories, setCategories] = useState<string[]>(
    defaultValue ||
      JSON.parse(localStorage.getItem(APP_CONFIGS.catsbusinessValue) || "[]"),
  );
  const [categoriesSuggestion, setCategoriesSuggestion] = useState<iCategory[]>(
    [],
  );
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  //
  const [showPopover, setShowPopover] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState("");

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(inputValue);
    },
    300,
    [inputValue],
  );

  // handle add
  const handleAddCategory = (item: iCategory) => {
    const itemValue = item?.names?.[i18n.language] ?? item?.name;
    const trimmedValue = itemValue.trim();

    if (!categories.includes(trimmedValue)) {
      const updatedCategories = [...categories, trimmedValue];
      setCategories(updatedCategories);
      setInputValue("");
      setValue("categories", [...getValues("categories"), item?.id]);

      // Store updated categories in localStorage
      localStorage.setItem(
        APP_CONFIGS.catsbusinessValue,
        JSON.stringify(updatedCategories),
      );
    }
    setShowPopover(false);
  };

  // handle remove
  const handleRemoveCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
    setValue(
      "categories",
      _.remove(getValues("categories"), (_, i) => i !== index),
    );
  };

  const { data, refetch } = useQuery({
    queryKey: ["business"],
    // get suggestion categories func in services
    queryFn: () => suggestionCategories(debouncedValue, i18n.language),
    enabled: false,
  });

  // set cats data suggestion
  useEffect(() => {
    data && setCategoriesSuggestion(data);
  }, [data]);

  // refetch data when debounceValue change
  useEffect(() => {
    refetch();
  }, [debouncedValue, refetch]);

  // handle click outsite
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

  // autofocus input
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

  const renderNoInclude = (text: string, index: number) => {
    return (
      <div className="relative flex items-center" key={index}>
        <Badge name={text} color="green" />
        <i
          onClick={() => handleRemoveCategory(index)}
          className="las la-times-circle absolute -right-1 -top-1 cursor-pointer text-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        ></i>
      </div>
    );
  };

  return (
    <>
      {hasLabel && (
        <span className="block text-lg font-semibold">
          {t("addBusiness:step1.chooseBusinessCats")}
        </span>
      )}
      {errors?.categories && (
        <p className="ml-1 mt-1 text-sm text-red-500">
          {String(errors?.categories?.message) ||
            t("addBusiness:error.missingField")}
        </p>
      )}
      <FormItem
        required
        label={hasLabel ? t("addBusiness:step1.businessCats") : ""}
        desc={hasLabel ? t("addBusiness:step1.helperInfomation") : ""}
      >
        <div
          className="relative flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-x-5 sm:space-y-0"
          ref={containerRef}
        >
          <label
            htmlFor="inputCats"
            className="flex min-h-full w-full flex-row flex-wrap gap-2 rounded-lg border border-neutral-200 bg-white p-2 dark:bg-neutral-900"
          >
            {categories?.length > 0 && (
              <div className="flex w-max flex-wrap items-center gap-2 dark:divide-neutral-800 ">
                {categories.map((category, index) =>
                  renderNoInclude(category, index),
                )}
                <input
                  onClick={() => {
                    setShowPopover(true);
                    clearErrors("categories");
                  }}
                  id="inputCats"
                  ref={inputRef}
                  value={inputValue}
                  className="flex-1 outline-none dark:bg-neutral-900"
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            )}
            <input
              onClick={() => {
                setShowPopover(true);
                clearErrors("categories");
              }}
              id="inputCats"
              ref={inputRef}
              value={inputValue}
              className={`flex-1 outline-none ${categories.length > 0 ? "hidden" : ""} dark:bg-neutral-900`}
              placeholder={t("addBusiness:step1.exampleCats")}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </label>

          {showPopover && (
            <div className="absolute top-1/2 z-0 h-8 -translate-y-1/2 self-center bg-white dark:bg-neutral-800" />
          )}

          {showPopover && categoriesSuggestion?.length > 0 && (
            <div className="absolute left-0 top-full z-40 mt-3 max-h-64 w-full min-w-[300px] max-w-[600px] overflow-y-auto overscroll-contain rounded-3xl bg-white shadow-xl dark:bg-neutral-800 sm:min-w-[600px]">
              {categoriesSuggestion.map((suggest, index) => (
                <span
                  key={index}
                  onClick={() => handleAddCategory(suggest)}
                  className="flex cursor-pointer items-center space-x-3 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 sm:space-x-4 sm:px-8"
                >
                  <span className="block font-medium text-neutral-6000 dark:text-neutral-400">
                    {suggest?.names?.[i18n.language] || suggest?.name || ""}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </FormItem>
    </>
  );
};

export default AddCatsForm;
