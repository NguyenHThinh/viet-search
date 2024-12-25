import type { FC } from "react";
import React from "react";

import GuestsInput from "../GuestsInput";
import LocationInput from "../LocationInput";
import ExperiencesDateSingleInput from "./ExperiencesDateSingleInput";

export interface ExperiencesSearchFormProps {}

const ExperiencesSearchForm: FC<ExperiencesSearchFormProps> = ({}) => {
  const renderForm = () => {
    return (
      <form className="relative mt-8 flex w-full flex-col rounded-3xl  bg-white shadow-xl dark:bg-neutral-800 dark:shadow-2xl md:flex-row md:rounded-full ">
        <LocationInput className="flex-[1.5]" />
        <div className="h-8 self-center border-r border-slate-200 dark:border-slate-700" />
        <ExperiencesDateSingleInput className="flex-1" />
        <div className="h-8 self-center border-r border-slate-200 dark:border-slate-700" />
        <GuestsInput
          className="flex-1"
          buttonSubmitHref="/listing-experiences"
        />
      </form>
    );
  };

  return renderForm();
};

export default ExperiencesSearchForm;
