import { CheckIcon } from "@heroicons/react/24/outline";
import { TFunction } from "i18next";
import { Fragment } from "react";

const Steper = ({ currentStep, t }: { currentStep: number; t: TFunction }) => {
  const steps: { number: number; text: string }[] = [
    {
      number: 1,
      text: t("addBusiness:stepTitle.infomation"),
    },
    {
      number: 2,
      text: t("addBusiness:stepTitle.contacts"),
    },
    {
      number: 3,
      text: t("addBusiness:stepTitle.openTime"),
    },
    {
      number: 4,
      text: t("addBusiness:stepTitle.images"),
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {steps.map((step, index) => (
        <div key={index} className="col-span-1 flex items-center gap-4">
          <div className="text-primary flex cursor-default items-center">
            <div
              className={`bg-primary flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-800 dark:text-neutral-200 ${currentStep >= step.number ? "bg-[#2ca6d1] text-white" : ""}`}
            >
              {step.number < currentStep ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                step.number
              )}
            </div>
            <span className="ml-2">{step.text}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 border-b border-neutral-200 dark:border-neutral-700"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Steper;
