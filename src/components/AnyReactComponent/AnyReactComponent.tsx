"use client";

import { Transition } from "@headlessui/react";
import type { FC } from "react";
import React, { Fragment, useState } from "react";

import CarCard from "@/components/CarCard";
import ExperiencesCard from "@/components/ExperiencesCard";
import BusinessCard from "@/components/BusinessCard";
import type { CarDataType, ExperiencesDataType } from "@/data/types";
import { IBusiness } from "@/models/iBusiness";
import { useTranslation } from "@/app/i18n/client";

export interface AnyReactComponentProps {
  className?: string;
  listing?: IBusiness;
  experiences?: ExperiencesDataType;
  car?: CarDataType;
  isSelected?: boolean;
  lat: number;
  lng: number;
  mark: number;
}

const AnyReactComponent: FC<AnyReactComponentProps> = ({
  className = "",
  listing,
  car,
  experiences,
  isSelected,
  mark,
}) => {
  const { i18n } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`nc-AnyReactComponent relative  ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span
        className={`inline-block min-w-[150px] rounded-lg bg-white px-2 py-1 text-center text-sm font-semibold shadow-lg transition-colors hover:bg-neutral-900 hover:text-white dark:bg-neutral-900 dark:hover:bg-white dark:hover:text-neutral-900 ${
          isSelected
            ? "bg-neutral-900 text-red-800 dark:bg-white dark:text-neutral-900"
            : ""
        }`}
      >
        {listing?.name || mark}
      </span>
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="aspect-w-1 absolute -left-12 bottom-full z-50 w-[260px] pb-3">
          {listing && (
            <BusinessCard
              size="small"
              data={listing}
              className="shadow-2xl"
              lng={i18n.language}
            />
          )}
          {experiences && (
            <ExperiencesCard
              size="small"
              data={experiences}
              ratioClass="aspect-w-12 aspect-h-10"
              className="rounded-3xl bg-white shadow-2xl dark:bg-neutral-900"
            />
          )}
          {car && <CarCard size="small" data={car} className="shadow-2xl " />}
        </div>
      </Transition>
    </div>
  );
};

export default AnyReactComponent;
