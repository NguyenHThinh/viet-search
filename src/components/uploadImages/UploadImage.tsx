"use client";

import { useTranslation } from "@/app/i18n/client";
import { uploadImages } from "@/services/storageImg";
import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import AppImageWithLoading from "../AppImageWithLoading";
import { XCircleIcon } from "@heroicons/react/24/solid";
import _ from "lodash";
import { ReviewFormData } from "@/models/iCommentAndReview";
import ListingImageGallery from "../listing-image-gallery/ListingImageGallery";
import { useDropzone } from "react-dropzone";
import { useWindowSize } from "react-use";

interface UploadImageProps {
  isMultiple: boolean;
  setError?: (text: string) => void;
  reviewFormData: ReviewFormData;
  setReviewFormData: (data: ReviewFormData) => void;
}

const UploadImage: FC<UploadImageProps> = ({
  isMultiple,
  setError,
  reviewFormData,
  setReviewFormData,
}) => {
  const { t } = useTranslation("detail");
  //
  const windowWidth = useWindowSize().width;
  const [maxItems, setMaxItems] = useState(4);
  //
  const [isLoading, setIsLoading] = useState(false);
  const [numberUploadImage, setNumberUploadImage] = useState(0);
  //
  const [imagePreviewArr, setImagePreviewArr] = useState<string[]>(
    reviewFormData?.images ?? [],
  );
  //
  const [isOpenGallery, setIsOpenGallery] = useState(false);
  const [listImageGallery, setListImageGallery] = useState<
    { id: number; url: string }[] | undefined
  >(undefined);

  useEffect(() => {
    const newListImageGallery = imagePreviewArr.map((url, index) => ({
      id: index,
      url: url ?? "",
    }));
    setListImageGallery(newListImageGallery);
  }, [imagePreviewArr]);

  // handle drop image
  const onDrop = (acceptedFiles: File[]) => {
    handleUpload(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: isMultiple,
  });

  // responsive items mobile
  useEffect(() => {
    if (windowWidth < 500) {
      return setMaxItems(2);
    }
    if (windowWidth < 768) {
      return setMaxItems(3);
    }
    if (windowWidth < 1024) {
      return setMaxItems(3);
    }
    if (windowWidth < 1280) {
      return setMaxItems(4);
    }
    setMaxItems(4);
  }, [windowWidth]);

  //   handle send images into storage images
  const handleUpload = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) {
      return;
    }
    setNumberUploadImage(selectedFiles.length);
    setIsLoading(true);

    const formData = new FormData();
    if (isMultiple) {
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
    } else {
      formData.append("images", selectedFiles[0]);
    }

    try {
      const response = await uploadImages(formData);

      // Extract URLs from the response and pass them to onImagesChange
      const imageUrls = response.map(
        (img: { height: number; width: number; url: string; key: string }) =>
          img?.url ?? "",
      );
      const updatedImages = _.union(imagePreviewArr, imageUrls);

      setImagePreviewArr(updatedImages);
      setReviewFormData({
        ...reviewFormData,
        images: updatedImages,
      });
    } catch (error) {
      setError && setError(String(error));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // delete images uploaded
  const deleteImageComment = (index: number) => {
    const imageUrl = imagePreviewArr[index];
    setImagePreviewArr((prev) => _.without(prev, imageUrl));
    setReviewFormData({
      ...reviewFormData,
      images: _.without(reviewFormData.images, imageUrl),
    });
  };

  return (
    <>
      {/* HEADING */}
      <ListingImageGallery
        isShowModal={isOpenGallery}
        onClose={() => setIsOpenGallery(false)}
        images={listImageGallery}
      />
      <div
        className="mb-8 flex w-full items-center justify-start rounded-lg border border-dashed border-primary-400 p-3"
        {...getRootProps()}
      >
        <div className="cursor-pointer text-primary-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-cloud-upload"
            width={48}
            height={48}
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M7 18a4.6 4.4 0 0 1 0 -9h0a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
            <polyline points="9 15 12 12 15 15" />
            <line x1={12} y1={12} x2={12} y2={21} />
          </svg>
        </div>
        <p className="mb-0 ml-4 text-left text-base font-normal tracking-normal text-gray-600 dark:text-neutral-200">
          {t("dragOrDropHereOr")}
          {/* <label htmlFor="imageUpload"> */}
          <span className="ml-2 cursor-pointer text-primary-400">
            {t("upload")}
          </span>
          {/* </label> */}
        </p>
      </div>
      <div className="flex w-max flex-row items-center justify-center gap-2">
        {imagePreviewArr?.length > 0 &&
          imagePreviewArr?.slice(0, maxItems)?.map((url, index) => (
            <div key={url} className="relative h-32 w-32 cursor-pointer">
              <AppImageWithLoading
                src={url}
                alt=""
                fill
                className="rounded-lg object-cover"
                onClick={() => setIsOpenGallery(true)}
              />
              {index === maxItems - 1 && imagePreviewArr.length > maxItems ? (
                <></>
              ) : (
                <button
                  className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteImageComment(index);
                  }}
                >
                  <XCircleIcon className="h-5 w-5 rounded-full bg-white text-neutral-500" />
                </button>
              )}
              {index === maxItems - 1 && imagePreviewArr.length > maxItems && (
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpenGallery(true);
                  }}
                >
                  +{imagePreviewArr.length - maxItems + 1}
                </div>
              )}
            </div>
          ))}
        {!isLoading ? (
          <input
            {...getInputProps()}
            id="imageUpload"
            className="hidden"
            // onChange={handleFileChange}
          />
        ) : (
          Array(numberUploadImage)
            .fill(0)
            .slice(
              0,
              imagePreviewArr.length < maxItems
                ? maxItems - imagePreviewArr.length
                : 1,
            )
            .map((_, index) => (
              <div
                key={index}
                className="h-32 w-32 animate-pulse rounded-lg bg-gray-500"
              ></div>
            ))
        )}
      </div>
    </>
  );
};

export default UploadImage;
