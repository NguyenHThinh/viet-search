"use client";

import React, { FC, useEffect, useState } from "react";
import {
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
} from "react-hook-form";
import { useDropzone } from "react-dropzone";
import ListingImage from "../listing-image-gallery/ListingImage";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { uploadImages } from "@/services/storageImg";
import { useTranslation } from "@/app/i18n/client";
import { useRouter, useSearchParams } from "next/navigation";

interface RHFUploadImageProps {
  name: string;
  isMultiple?: boolean;
}

const RHFUploadImage: FC<RHFUploadImageProps> = ({
  name,
  isMultiple = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams.toString());
  const { t } = useTranslation("common");
  const {
    getValues,
    clearErrors,
    control,
    formState: { errors },
  } = useFormContext();
  //
  // check is array and convest string to array
  const prevFormData = Array.isArray(getValues(name))
    ? getValues(name)
    : getValues(name)
      ? [getValues(name)]
      : [];
  //
  const [isLoading, setIsLoading] = useState(false);
  const [numberUploadImage, setNumberUploadImage] = useState(0);
  //
  const [imagePreviewArr, setImagePreviewArr] =
    useState<string[]>(prevFormData);
  //
  const [isOpenGallery, setIsOpenGallery] = useState(false);
  const [listImageGallery, setListImageGallery] = useState<
    { id: number; url: string }[] | undefined
  >(undefined);

  // refactor images url for gallery
  useEffect(() => {
    const newListImageGallery = imagePreviewArr.map((url, index) => ({
      id: index,
      url: url ?? "",
    }));
    setListImageGallery(newListImageGallery);
  }, [imagePreviewArr]);

  // handle upload file on storage api server
  const handleUpload = async (
    selectedFiles: File[],
    onChange: (value: string[]) => void,
  ) => {
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

      // clean array image
      const updatedImages = isMultiple
        ? [...imagePreviewArr, ...imageUrls]
        : [imageUrls[0]];

      onChange(isMultiple ? updatedImages : updatedImages[0]);

      setImagePreviewArr(updatedImages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle delete image
  const deleteImage = (
    index: number,
    onChange: (value: string[] | string) => void,
  ) => {
    const updatedImages = imagePreviewArr.filter((_, i) => i !== index);
    setImagePreviewArr(updatedImages);

    onChange(updatedImages.length > 0 ? updatedImages : isMultiple ? [] : "");
  };

  const getErrorMessage = (
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined,
  ): string | null => {
    if (error) {
      return error.message as string;
    }
    return null;
  };

  //
  //
  const handleSelectImage = (photoId: number) => {
    setIsOpenGallery(true);
    router.push(`?${currentParams.toString()}&photoId=${photoId}`);
  };

  return (
    <div>
      <ListingImage
        isShowModal={isOpenGallery}
        onClose={() => setIsOpenGallery(false)}
        images={listImageGallery}
      />
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const { getRootProps, getInputProps } = useDropzone({
            onDrop: (acceptedFiles) => handleUpload(acceptedFiles, onChange),
            accept: {
              "image/*": [],
            },
            multiple: isMultiple,
          });
          return (
            <>
              <div
                {...getRootProps()}
                className="mt-1 flex justify-center rounded-md border-2 border-dashed border-neutral-300 px-6 pb-6 pt-5 dark:border-neutral-6000"
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-neutral-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <div className="flex text-sm text-neutral-6000 dark:text-neutral-300">
                    <label className="relative cursor-pointer rounded-md font-medium text-primary-6000 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500">
                      <span>{t("uploadImage")}</span>
                      <input
                        {...getInputProps}
                        className="hidden"
                        onClick={() => clearErrors(name)}
                      />
                    </label>
                    <p className="pl-1">{t("dragAndDrop")}</p>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t("typeFile")}
                  </p>
                </div>
              </div>
              <div className="mt-8 grid w-full grid-cols-12 flex-row items-center justify-center gap-3">
                {imagePreviewArr?.length > 0 &&
                  imagePreviewArr?.map((url, index) => (
                    <div
                      key={index}
                      className="relative col-span-4 aspect-1 w-full cursor-pointer md:col-span-3"
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="rounded-lg object-cover"
                        onClick={() => handleSelectImage(index)}
                      />
                      <button
                        className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteImage(index, onChange);
                        }}
                      >
                        <XCircleIcon className="h-5 w-5 rounded-full bg-white text-neutral-500" />
                      </button>
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
                    .map((_, index) => (
                      <div
                        key={index}
                        className="col-span-4 aspect-1 w-full animate-pulse rounded-lg bg-gray-500 md:col-span-3"
                      ></div>
                    ))
                )}
              </div>
            </>
          );
        }}
      />

      {/* show preview images */}

      {errors[name] && name && (
        <p className="mt-2 text-red-500">
          {getErrorMessage(
            errors[name] as
              | FieldError
              | Merge<FieldError, FieldErrorsImpl<any>>,
          )}
        </p>
      )}
    </div>
  );
};

export default RHFUploadImage;
