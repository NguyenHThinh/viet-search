"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "@/shared/ButtonClose";
import { usePathname } from "next/navigation";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@/app/i18n/client";

const LikeSaveBtns = () => {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const [urlPathName, setUrlPathName] = useState("");
  const [isOpenShare, setIsOpenShare] = useState(false);
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrlPathName(`${window.location.origin}${pathname}`);
    }
  }, []);

  const handOpenAlert = () => {
    setIsAlert(true);
    setTimeout(() => {
      setIsAlert(false);
    }, 3000);
  };

  const handleCopyURL = () => {
    if (!window) return;
    navigator.clipboard.writeText(urlPathName).then(handOpenAlert);
  };

  return (
    <div className="flow-root">
      <Transition appear show={isOpenShare} as={Fragment}>
        <Dialog
          onClose={() => setIsOpenShare(false)}
          className="relative z-50"
          as="div"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <Dialog.Panel className="inline-flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all dark:border dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-100">
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 text-center dark:border-neutral-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-neutral-200"
                >
                  {t("shareBusiness")}
                </Dialog.Title>
                <span>
                  <ButtonClose onClick={() => setIsOpenShare(false)} />
                </span>
              </div>
              <div className="flex items-center space-x-4 p-6">
                <input
                  type="text"
                  value={urlPathName}
                  readOnly
                  className="flex-1 rounded border px-2 py-1 dark:bg-neutral-900 dark:text-neutral-200"
                />
                <button
                  onClick={handleCopyURL}
                  className="flex items-center justify-center rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-6000 dark:text-neutral-200"
                >
                  {isAlert ? <CheckIcon className="h-5 w-5" /> : t("coppy")}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
      <div className="-mx-3 -my-1.5 flex text-sm text-neutral-700 dark:text-neutral-300">
        <span
          className="flex cursor-pointer rounded-lg px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={() => setIsOpenShare(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span className="ml-2.5 hidden sm:block">{t("share")}</span>
        </span>
        <span className="flex cursor-pointer rounded-lg px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="ml-2.5 hidden sm:block">{t("save")}</span>
        </span>
      </div>
    </div>
  );
};

export default LikeSaveBtns;
