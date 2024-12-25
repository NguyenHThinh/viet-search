import type { ButtonHTMLAttributes, FC } from "react";
import React from "react";

import twFocusClass from "@/utils/twFocusClass";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const PrevBtn: FC<Props> = ({ className = "w-10 h-10 text-lg", ...args }) => {
  return (
    <button
      className={`PrevBtn ${className} items-center justify-center rounded-full border border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-6000 dark:bg-neutral-900 dark:hover:border-neutral-500 lg:inline-flex ${twFocusClass()}`}
      {...args}
    >
      <i className="las la-angle-left" />
    </button>
  );
};

export default PrevBtn;
