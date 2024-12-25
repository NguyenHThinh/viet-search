import type { FC } from "react";
import React from "react";

import BusinessInput from "../BusinessInput";
import ButtonBusinessSubmit from "../ButtonBusinessSubmit";
import WhereInput from "../WhereInput";
import {
  GlobeAltIcon,
  LightBulbIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface BusinessSearchFormProps {
  value: {
    q: string;
    where: string;
  };
  setValue: (value: { q: string; where: string }) => void;
}

export const renderIconTypes = (type: string) => {
  switch (type) {
    case "countries":
      return (
        <GlobeAltIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400 lg:h-6 lg:w-6 " />
      );
    case "regions":
      return (
        <MapPinIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400 lg:h-6 lg:w-6" />
      );
    // case "categories":
    //   return (
    //     <LightBulbIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
    //   );
    default:
      return null;
  }
};

const BusinessSearchForm: FC<BusinessSearchFormProps> = ({
  value,
  setValue,
}) => {
  const setInputQueryWhat = (q: string) => {
    setValue({
      ...value,
      q,
    });
  };

  const setInputQueryWhere = (where: string) => {
    setValue({
      ...value,
      where,
    });
  };

  const renderForm = () => {
    return (
      <form className="relative mt-8 flex w-full rounded-full bg-white shadow-xl dark:bg-neutral-800 dark:shadow-2xl">
        <BusinessInput
          className="flex-[1.5]"
          value={value?.q}
          setValue={setInputQueryWhat}
        />
        <div className="h-8 self-center border-r border-slate-200 dark:border-slate-700" />
        <WhereInput
          className="flex-[1.5]"
          value={value?.where}
          setValue={setInputQueryWhere}
        />
        <div className="mr-5 h-12 self-center border-r border-slate-200 dark:border-slate-700" />
        <div className="flex items-center pr-2 xl:pr-4">
          <ButtonBusinessSubmit value={value} />
        </div>
      </form>
    );
  };

  return renderForm();
};

export default BusinessSearchForm;
