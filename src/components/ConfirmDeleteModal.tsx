"use client";

import { useTranslation } from "@/app/i18n/client";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { FC, Fragment, useState } from "react";
import parse from "html-react-parser";
import Input from "@/shared/Input";
import { Trans } from "react-i18next";

type typeDeleteConfirm = "business";

interface ConfirmDeleteModalProps {
  isShowModal: boolean;
  onCancel: () => void;
  isLoading: boolean;
  onConfirm: () => void;
  typeDelete?: typeDeleteConfirm;
}

const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({
  isShowModal,
  onCancel,
  onConfirm,
  isLoading,
  typeDelete = "business",
}) => {
  const { t } = useTranslation(["common", "dashBoard"]);
  const DELETE_CONFIRM_TEXT = "delete";

  const [inputDeleteText, setInputDeleteText] = useState("");
  const [notiText, setNotiText] = useState("");

  const handleCancelDeleteAction = () => {
    setNotiText("");
    setInputDeleteText("");
    onCancel();
  };

  const handleConfirmDeleteAction = () => {
    if (inputDeleteText === DELETE_CONFIRM_TEXT) {
      onConfirm();
    } else {
      setNotiText("Nhập sai rồi");
    }
  };

  //
  const renderTitleConfirm = (typeDelete: string) => {
    switch (typeDelete) {
      case "business":
        return (
          <h2 className="cursor-default text-xl font-semibold">
            {t("dashBoard:deleteBusinessTitle")}
          </h2>
        );

      //
      default:
        return (
          <h2 className="cursor-default text-xl font-semibold">
            {t("common:confirmDelete")}
          </h2>
        );
    }
  };

  // render content delete confirm
  const renderHelpTextConfirm = (typeDelete: string) => {
    switch (typeDelete) {
      case "business":
        return parse(t("dashBoard:deleteBusinessHelpText"));

      //
      default:
        return (
          <h2 className="cursor-default text-2xl font-semibold">
            {t("common:confirmDeleteText")}
          </h2>
        );
    }
  };

  return (
    <Transition appear show={isShowModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={handleCancelDeleteAction}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white bg-opacity-30 dark:bg-opacity-5" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center pt-0 text-center sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-5"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-5"
            >
              <Dialog.Panel className="w-full max-w-2xl rounded-2xl border bg-neutral-50 pt-0 text-left shadow-md transition-all dark:bg-neutral-800">
                {/* title */}
                <div className="flex items-center justify-between border-b p-5 pb-4">
                  {renderTitleConfirm(typeDelete)}
                  <XMarkIcon
                    className="block h-5 w-5 cursor-pointer"
                    onClick={handleCancelDeleteAction}
                  />
                </div>

                {/* content text */}
                {renderHelpTextConfirm(typeDelete)}

                {/* Input confirm delete */}
                <div className="space-y-2 px-5">
                  <p>
                    <Trans
                      i18nKey="dashBoard:deleteConfirmation"
                      values={{ DELETE_CONFIRM_TEXT }}
                      components={{ strong: <strong /> }}
                    />
                  </p>
                  <Input
                    value={inputDeleteText}
                    onChange={(e) => setInputDeleteText(e.target.value)}
                    onFocus={() => notiText && setNotiText("")}
                  />
                  {notiText && (
                    <p className="text-sm font-medium text-red-500">
                      {notiText}
                    </p>
                  )}
                </div>

                {/* control handle */}
                <div className="flex items-center justify-end gap-3 p-5">
                  <ButtonSecondary
                    className="rounded-full border !px-4 !py-2 shadow-md"
                    onClick={handleCancelDeleteAction}
                  >
                    {t("common:cancel")}
                  </ButtonSecondary>
                  <ButtonPrimary
                    loading={isLoading}
                    className="rounded-full border border-primary-400 !px-4 !py-2 shadow-md"
                    onClick={handleConfirmDeleteAction}
                  >
                    {t("common:confirm")}
                  </ButtonPrimary>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmDeleteModal;
