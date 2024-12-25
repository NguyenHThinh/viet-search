import type { FC } from "react";
import React from "react";

import type { StaySearchFormFields } from "../../type";
import GuestsInput from "../GuestsInput";
import LocationInput from "../LocationInput";
import StayDatesRangeInput from "./StayDatesRangeInput";

export interface StaySearchFormProps {
  defaultFieldFocus?: StaySearchFormFields;
}

const StaySearchForm: FC<StaySearchFormProps> = ({ defaultFieldFocus }) => {
  const renderForm = () => {
    return (
      <form className="relative flex rounded-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
        <LocationInput
          // onInputDone={() => setDateFocused("startDate")}
          className="flex-[1.5]"
          autoFocus={defaultFieldFocus === "location"}
        />
        <div className="h-8 self-center border-r border-slate-200 dark:border-slate-700" />
        <StayDatesRangeInput className="flex-[1.2]" />

        <div className="h-8 self-center border-r border-slate-200 dark:border-slate-700" />
        <GuestsInput
          className="flex-1"
          autoFocus={defaultFieldFocus === "guests"}
          submitLink="/listing-stay"
        />
      </form>
    );
  };

  return renderForm();
};

export default StaySearchForm;
