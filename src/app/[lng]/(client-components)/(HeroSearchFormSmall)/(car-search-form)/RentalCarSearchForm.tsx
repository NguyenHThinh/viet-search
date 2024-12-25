"use client";

import type { FC } from "react";
import React, { useState } from "react";

import LocationInput from "../LocationInput";
import RentalCarDatesRangeInput from "./RentalCarDatesRangeInput";

export interface RentalCarSearchFormProps {}

const RentalCarSearchForm: FC<RentalCarSearchFormProps> = ({}) => {
  const [dropOffLocationType, setDropOffLocationType] = useState<
    "same" | "different"
  >("different");

  const renderRadioBtn = () => {
    return (
      <div className="flex items-center justify-center space-x-3 pb-3">
        <div
          className={`flex cursor-pointer items-center rounded-full px-4 py-1.5 text-xs font-medium ${
            dropOffLocationType === "same"
              ? "bg-black text-white shadow-lg shadow-black/10"
              : "border border-neutral-300 dark:border-neutral-700"
          }`}
          onClick={(e) => setDropOffLocationType("same")}
        >
          Same drop off
        </div>
        <div
          className={`flex cursor-pointer items-center rounded-full px-4 py-1.5 text-xs font-medium ${
            dropOffLocationType === "different"
              ? "bg-black text-white shadow-lg shadow-black/10"
              : "border border-neutral-300 dark:border-neutral-700"
          }`}
          onClick={(e) => setDropOffLocationType("different")}
        >
          Different drop off
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <form className="relative w-full ">
        {renderRadioBtn()}
        <div className="flex w-full flex-row rounded-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <LocationInput
            placeHolder="City or Airport"
            desc="Pick up location"
            className="flex-1"
          />
          {dropOffLocationType === "different" && (
            <>
              <div className="h-8 self-center border-r border-slate-200 dark:border-slate-700" />
              <LocationInput
                placeHolder="City or Airport"
                desc="Drop off location"
                className="flex-1"
                divHideVerticalLineClass="-inset-x-0.5"
              />
            </>
          )}
          <div className="h-8 self-center border-r border-slate-200 dark:border-slate-700" />
          <RentalCarDatesRangeInput className="flex-1" />
        </div>
      </form>
    );
  };

  return renderForm();
};

export default RentalCarSearchForm;
