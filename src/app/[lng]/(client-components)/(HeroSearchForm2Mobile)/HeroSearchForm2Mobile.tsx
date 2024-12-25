"use client";

import { Dialog, Tab, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { Fragment, useEffect, useState } from "react";
import { useTimeoutFn } from "react-use";

import SearchButtonSubmit from "./SearchButtonSubmit";
import { useSearchParams } from "next/navigation";
import BusinessSearchForm from "./(business-search-form)/BusinessSearchForm";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";
import useSuggestionContext from "@/hooks/useSuggestionContext";
import { useTranslation } from "@/app/i18n/client";

interface ValueState {
  q: string;
  where: string;
}

const HeroSearchForm2Mobile = () => {
  const { t } = useTranslation(["search", "common"]);
  const { setFilter } = useBusinessSearchContext();
  const { handleStoreSuggestions } = useSuggestionContext();
  const [showModal, setShowModal] = useState(false);
  const params = useSearchParams();
  const [value, setValue] = useState<ValueState>({
    q: "",
    where: "",
  });

  useEffect(() => {
    setValue({
      q: params.get("q") ?? "",
      where: params.get("where") ?? "",
    });
  }, [params]);

  // FOR RESET ALL DATA WHEN CLICK CLEAR BUTTON
  const [showDialog, setShowDialog] = useState(false);
  const [, , resetIsShowingDialog] = useTimeoutFn(() => {
    const emptyValues = Object.keys(value).reduce(
      (acc, key) => {
        acc[key as keyof ValueState] = "";
        return acc;
      },
      {} as { q: string; where: string },
    );

    setValue(emptyValues);
    setShowDialog(true);
  }, 1);
  //
  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const renderButtonOpenModal = () => {
    return (
      <button
        onClick={openModal}
        className="relative flex w-full items-center rounded-full border border-neutral-200 px-4 py-2 pr-11 shadow-lg dark:border-neutral-6000"
      >
        <MagnifyingGlassIcon className="h-5 w-5 shrink-0" />

        <div className="ml-3 flex-1 overflow-hidden text-left">
          <span className="block text-sm font-medium">
            {value?.q || t("search:searchBusiness")}
          </span>
          <span className="mt-0.5 block text-xs font-light text-neutral-500 dark:text-neutral-400 ">
            <span className="line-clamp-1">
              {t("search:anyWhereAnyBusiness")}
            </span>
          </span>
        </div>

        <span className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-6000 dark:text-neutral-300">
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="block h-4 w-4"
            fill="currentColor"
          >
            <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
          </svg>
        </span>
      </button>
    );
  };

  return (
    <div className="HeroSearchForm2Mobile">
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="HeroSearchFormMobile__Dialog z-max relative"
          onClose={closeModal}
        >
          <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
            <div className="flex h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out transition-transform"
                enterFrom="opacity-0 translate-y-52"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in transition-transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-52"
              >
                <Dialog.Panel className="relative flex h-full flex-1 flex-col justify-between overflow-hidden ">
                  {showDialog && (
                    <Tab.Group manual>
                      <div className="absolute left-4 top-4">
                        <button className="" onClick={closeModal}>
                          <XMarkIcon className="h-5 w-5 text-black dark:text-white" />
                        </button>
                      </div>

                      <div className="flex flex-1 overflow-hidden px-1.5 pt-6 sm:px-4">
                        <Tab.Panels className="hiddenScrollbar flex-1 overflow-y-auto py-4">
                          <Tab.Panel>
                            <div className="animate-[myblur_0.4s_ease-in-out] transition-opacity">
                              <BusinessSearchForm
                                value={value}
                                setValue={setValue}
                              />
                            </div>
                          </Tab.Panel>
                        </Tab.Panels>
                      </div>
                      <div className="flex justify-between border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
                        <button
                          type="button"
                          className="shrink-0 font-semibold underline"
                          onClick={() => {
                            setShowDialog(false);
                            resetIsShowingDialog();
                          }}
                        >
                          {t("common:clearAll")}
                        </button>
                        <SearchButtonSubmit
                          t={t}
                          onClick={() => {
                            value?.q && handleStoreSuggestions(value?.q);
                            value?.where &&
                              handleStoreSuggestions(value?.where, true);
                            setFilter({ q: value?.q, where: value?.where });
                            closeModal();
                          }}
                        />
                      </div>
                    </Tab.Group>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default HeroSearchForm2Mobile;