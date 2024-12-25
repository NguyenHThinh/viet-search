"use client";

import { useTranslation } from "@/app/i18n/client";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { Dialog, Transition } from "@headlessui/react";
import { Point } from "framer-motion";
import React, { Fragment, useEffect, useState } from "react";
import Cropper from "react-easy-crop";

interface CropPopupProps {
  isCropping: boolean;
  handleCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  setIsCropping: (x: boolean) => void;
  handleSaveCrop: () => void;
  imageSrc: string;
  isLoading: boolean;
}

function CropPopup({
  isCropping,
  handleCropComplete,
  setIsCropping,
  handleSaveCrop,
  imageSrc,
  isLoading,
}: CropPopupProps) {
  const { t } = useTranslation(["common", "addBusiness"]);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // reset stat
  useEffect(() => {
    return () => {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
  }, []);

  return (
    <Transition appear show={isCropping} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsCropping(false)}
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {t("addBusiness:logo")}
                </Dialog.Title>
                <div className="relative mt-4 h-64 w-full">
                  <Cropper
                    image={imageSrc!}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={handleCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className="mt-4 w-full">
                  <input
                    type="range"
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <ButtonSecondary
                    className="!py-2 text-sm font-semibold"
                    onClick={() => setIsCropping(false)}
                  >
                    {t("common:cancel")}
                  </ButtonSecondary>
                  <ButtonPrimary
                    loading={isLoading}
                    className="!py-2 text-sm font-semibold"
                    onClick={handleSaveCrop}
                  >
                    {t("common:saveUpdate")}
                  </ButtonPrimary>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CropPopup;
