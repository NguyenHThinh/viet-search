"use client";

import type { FC } from "react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";

import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";

export interface StayDatesRangeInputProps {
  className?: string;
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  className = "",
}) => {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2023/02/06"),
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2023/02/23"));

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div>
      <div className="p-5">
        <span className="block text-xl font-semibold sm:text-2xl">
          {` When's your trip?`}
        </span>
      </div>
      <div
        className={`relative z-10 flex shrink-0 justify-center py-5 ${className} `}
      >
        <DatePicker
          selected={startDate}
          onChange={onChangeDate}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          monthsShown={2}
          showPopperArrow={false}
          inline
          renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
          renderDayContents={(day, date) => (
            <DatePickerCustomDay dayOfMonth={day} date={date} />
          )}
        />
      </div>
    </div>
  );
};

export default StayDatesRangeInput;
