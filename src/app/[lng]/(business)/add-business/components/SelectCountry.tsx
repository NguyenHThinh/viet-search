"use client";

import Input from "@/shared/Input";
import { useEffect, useRef, useState } from "react";
import { FieldErrorsImpl, useFormContext } from "react-hook-form";
import FormItem from "./FormItem";
import { useDebounce } from "react-use";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/app/i18n/client";
import { WhereSuggestion } from "@/contexts/suggestionContext";
import { iFormSchema } from "../form-config";
import { suggestionContries } from "@/services/business";

const SelectCountry = () => {
  //
  const { t, i18n } = useTranslation(["common", "addBusiness"]);
  const {
    register,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const [countriesSuggestion, setCountriesSuggestion] = useState<
    WhereSuggestion[]
  >([]);
  const [inputValue, setInputValue] = useState(
    getValues("address.country") || "",
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showPopover, setShowPopover] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(inputValue);
    },
    300,
    [inputValue],
  );

  const { data, refetch } = useQuery({
    queryKey: ["business"],
    // get suggestion countries func in services
    queryFn: () => suggestionContries(debouncedValue, i18n.language),
    enabled: false,
  });

  // set cats data suggestion
  useEffect(() => {
    data && setCountriesSuggestion(data);
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

  const handleSelectLocation = (item: string) => {
    setValue("address.country", item);
    setInputValue(item);
    setShowPopover(false);
  };

  return (
    <>
      <FormItem
        required
        label={t("addBusiness:step2.countryRegion")}
        desc={t("addBusiness:step2.selectCountry")}
      >
        <div
          className="relative flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-x-5 sm:space-y-0"
          ref={containerRef}
        >
          <Input
            autoComplete="off"
            {...register("address.country")}
            onClick={() => {
              setShowPopover(true);
              clearErrors("address.country");
            }}
            ref={inputRef}
            value={inputValue}
            className="!h-full"
            onChange={(e) => {
              setInputValue(e.target.value);
              setValue("address.country", "");
            }}
          />

          {showPopover && (
            <div className="absolute top-1/2 z-0 h-8 -translate-y-1/2 self-center bg-white dark:bg-neutral-800" />
          )}

          {showPopover && countriesSuggestion?.length > 0 && (
            <div className="absolute left-0 top-full z-40 mt-3 max-h-64 w-full min-w-[300px] max-w-[600px] overflow-y-auto overscroll-contain rounded-3xl bg-white shadow-xl dark:bg-neutral-800 sm:min-w-[600px]">
              {countriesSuggestion.map(
                (suggest, index) =>
                  // check countries type
                  suggest.type === "countries" && (
                    <span
                      key={index}
                      onClick={() =>
                        handleSelectLocation(suggest?.names?.[i18n.language])
                      }
                      className="flex cursor-pointer items-center space-x-3 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 sm:space-x-4 sm:px-8"
                    >
                      <span className="block font-medium text-neutral-6000 dark:text-neutral-400">
                        {suggest?.names?.[i18n.language] || suggest?.name || ""}
                      </span>
                    </span>
                  ),
              )}
            </div>
          )}
        </div>
        {(errors.address as FieldErrorsImpl<iFormSchema["address"]>)
          ?.country && (
          <p className="ml-1 mt-1 text-sm text-red-500">
            {String(
              (errors.address as FieldErrorsImpl<iFormSchema["address"]>)
                ?.country?.message,
            ) || "Missing this field"}
          </p>
        )}
      </FormItem>
    </>
  );
};

export default SelectCountry;
