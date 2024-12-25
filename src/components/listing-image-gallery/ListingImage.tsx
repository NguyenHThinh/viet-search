"use client";

import "./styles/index.css";

import { Dialog, Transition } from "@headlessui/react";
import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import type { Route } from "next";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FC } from "react";
import { Fragment, useEffect, useRef } from "react";

import LikeSaveBtns from "../LikeSaveBtns";
import Modal from "./components/Modal";
import type { ListingGalleryImage } from "./utils/types";
import { useLastViewedPhoto } from "./utils/useLastViewedPhoto";
import AppImageWithLoading from "../AppImageWithLoading";

const PHOTOS: string[] = [
  "https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
  "https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/6438752/pexels-photo-6438752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
];

export const DEMO_IMAGE: ListingGalleryImage[] = [...PHOTOS].map(
  (item, index): ListingGalleryImage => {
    return {
      id: index,
      url: item,
    };
  },
);

export const getNewParam = ({
  paramName = "photoId",
  value,
}: {
  paramName?: string;
  value: string | number;
}) => {
  const params = new URLSearchParams(document.location.search);
  params.set(paramName, String(value));
  return params.toString();
};

interface Props {
  images?: ListingGalleryImage[];
  onClose?: () => void;
  isShowModal: boolean;
}

const ListingImage: FC<Props> = ({
  images = DEMO_IMAGE,
  onClose,
  isShowModal,
}) => {
  const searchParams = useSearchParams();
  const photoId = searchParams?.get("photoId");
  const router = useRouter();
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLDivElement>(null);
  const thisPathname = usePathname();
  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  const handleClose = () => {
    onClose && onClose();
  };

  const renderContent = () => {
    return (
      <div className=" ">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              // @ts-ignore
              setLastViewedPhoto(photoId);
              const params = new URLSearchParams(window.location.search);
              params.delete("photoId");
              router.push(`${thisPathname}/?${params.toString()}` as Route);
              handleClose();
            }}
          />
        )}
      </div>
    );
  };

  return (
    <Transition appear show={isShowModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 flex min-h-full items-center justify-center pt-0 text-center sm:p-4"
        onClose={handleClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-5"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-5"
        >
          <Dialog.Panel className="fixed inset-0 mx-auto p-4 pt-0 text-left transition-all">
            {renderContent()}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default ListingImage;
