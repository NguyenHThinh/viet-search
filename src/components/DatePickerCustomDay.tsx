import type { FC } from "react";
import React from "react";

interface Props {
  dayOfMonth: number;
  date?: Date | undefined;
}

const DatePickerCustomDay: FC<Props> = ({ dayOfMonth, date }) => {
  return <span className="react-datepicker__day_span">{dayOfMonth}</span>;
};

export default DatePickerCustomDay;
