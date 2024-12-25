"use client";

import Input from "@/shared/Input";
import { useFormContext } from "react-hook-form";
import FormItem from "./FormItem";
import { useTranslation } from "@/app/i18n/client";
import { MouseEvent, useState } from "react";
import Badge from "@/shared/Badge";

const KeywordsField = ({ hasLabel = true }: { hasLabel?: boolean }) => {
  //
  const { t } = useTranslation(["addBusiness"]);
  const { setValue, getValues } = useFormContext();
  const [keywords, setKeywords] = useState<string[]>(
    getValues("keywords") || [],
  );
  const [inputValue, setInputValue] = useState("");

  // handle add
  const handleAddCategory = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // clear space
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !keywords.includes(inputValue)) {
      setKeywords([...keywords, trimmedValue]);
      setInputValue("");
      setValue("keywords", [...keywords, trimmedValue]);
    }
  };

  // handle remove
  const handleRemoveCategory = (index: number) => {
    const newCategories = keywords.filter((_, i) => i !== index);
    setKeywords(newCategories);
    setValue("keywords", newCategories);
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
      <FormItem
        label={hasLabel ? t("addBusiness:step1.additionalKeywords") : ""}
      >
        <div className="flex flex-col gap-2 space-y-3 sm:flex-row sm:justify-between sm:space-y-0">
          <label
            htmlFor="inputKey"
            className="flex w-full max-w-[80%] flex-row flex-wrap gap-2 rounded-lg border border-neutral-200 bg-white p-2 dark:bg-neutral-900"
          >
            {keywords?.length > 0 && (
              <div className="flex w-max flex-wrap items-center gap-2 dark:divide-neutral-800 ">
                {keywords.map((keyword, index) =>
                  renderNoInclude(keyword, index),
                )}
                <input
                  id="inputKey"
                  value={inputValue}
                  className="flex-1 outline-none dark:bg-neutral-900"
                  // placeholder={t("addBusiness:step1.exampleKeywords")}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            )}
            <input
              id="inputKey"
              value={inputValue}
              className={`flex-1 outline-none ${keywords?.length > 0 ? "hidden" : ""} dark:bg-neutral-900`}
              placeholder={t("addBusiness:step1.exampleKeywords")}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </label>
          <button
            className="flex h-11 shrink-0 items-center justify-center rounded-full bg-primary-6000 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-primary-700"
            onClick={handleAddCategory}
          >
            <i className="las la-plus text-xl"></i>
            <span className="ml-3">{t("addBusiness:addTag")}</span>
          </button>
        </div>
      </FormItem>
    </>
  );
};

export default KeywordsField;
