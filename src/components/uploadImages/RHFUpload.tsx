"use client";

import React, { FC, useEffect, useState } from "react";
import {
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
} from "react-hook-form";
import { Accept, useDropzone } from "react-dropzone";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@/app/i18n/client";
import {
  DocumentIcon,
  DocumentTextIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { uploadFiles } from "@/services/storageImg";
import { AxiosProgressEvent } from "axios";

export interface ResponseUploadFiles {
  format: string;
  key: string;
  url: string;
  height: number;
  size: number;
  width: number;
}

interface RHFUploadProps {
  name: string;
  acceptType?: Accept;
  isMultiple?: boolean;
}

const RHFUpload: FC<RHFUploadProps> = ({
  name,
  acceptType = {
    "image/*": [], // image
    "application/pdf": [], // pdf
    "application/msword": [], //doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      [], //doc
  },
  isMultiple = false,
}) => {
  const { t } = useTranslation("common");
  const {
    getValues,
    clearErrors,
    control,
    formState: { errors },
  } = useFormContext();
  //
  const prevFormData = Array.isArray(getValues(name))
    ? getValues(name)
    : getValues(name)
      ? [getValues(name)]
      : [];
  //
  const [isLoading, setIsLoading] = useState(false);
  const [uploaFiles, setUploaFiles] =
    useState<ResponseUploadFiles[]>(prevFormData);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [filePreviewArr, setFilePreviewArr] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<{ [key: string]: boolean }>(
    {},
  );

  useEffect(() => {
    setUploaFiles(prevFormData);
  }, [prevFormData]);

  // handle upload file on storage api server
  const handleUpload = async (
    selectedFiles: File[],
    onChange: (value: File[]) => void,
  ) => {
    if (selectedFiles.length === 0) {
      return;
    }
    setFilePreviewArr((prev) => [...prev, ...selectedFiles]);
    setIsLoading(true);
    setUploadError({});
    setUploadProgress({});

    const formData = new FormData();
    if (isMultiple) {
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
    } else {
      formData.append("files", selectedFiles[0]);
    }

    try {
      const uploadProgressHandler = (progressEvent: AxiosProgressEvent) => {
        const total = progressEvent.total || 1;
        const progress = Math.round((progressEvent.loaded * 100) / total);
        setUploadProgress((prev) => ({ ...prev, total: progress }));
      };

      const response = await uploadFiles(formData, uploadProgressHandler);

      // Extract URLs from the response and pass them to onImagesChange
      const uploadedFiles = response.flat(); // Flatten in case of multiple files
      const updatedFiles = isMultiple
        ? [...uploaFiles, ...uploadedFiles]
        : [uploadedFiles[0]];

      onChange(isMultiple ? updatedFiles : updatedFiles[0]);
      setUploaFiles(updatedFiles);
    } catch (error) {
      setUploadError((prev) => ({ ...prev, general: true }));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle delete image
  const deleteFile = (
    index: number,
    onChange: (value: File[] | File) => void,
  ) => {
    const updatedFiles = filePreviewArr.filter((_, i) => i !== index);
    setFilePreviewArr(updatedFiles);

    onChange(
      updatedFiles.length > 0
        ? updatedFiles
        : isMultiple
          ? []
          : updatedFiles[0] || [],
    );
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
  const getFileIcon = (file: File) => {
    const fileType = file.type;

    if (fileType.includes("image/")) {
      return <PhotoIcon className="h-7 w-7 text-blue-500" />;
    } else if (fileType === "application/pdf") {
      return <DocumentIcon className="h-7 w-7 text-red-500" />;
    } else if (
      fileType === "application/msword" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return <DocumentTextIcon className="h-7 w-7 text-blue-700" />;
    } else {
      return <PaperClipIcon className="h-7 w-7 text-gray-500" />;
    }
  };

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const { getRootProps, getInputProps } = useDropzone({
            onDrop: (acceptedFiles) => handleUpload(acceptedFiles, onChange),
            accept: acceptType,
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
              <div className="mt-8 w-full flex-row items-center justify-center gap-3">
                {filePreviewArr.length > 0 &&
                  filePreviewArr.map((file, index) => (
                    <div key={index} className="relative w-max rounded-xl">
                      <div className="flex h-full w-full items-center justify-center space-x-2">
                        {getFileIcon(file)}
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          {uploadProgress.total !== undefined && (
                            <progress
                              className={`inline-block h-0.5 w-full ${uploadProgress.total === 100 ? "hidden" : ""}`}
                              value={uploadProgress.total}
                              max="100"
                            />
                          )}
                          {uploadError[file.name] && (
                            <p className="text-xs text-red-500">
                              {uploadError[file.name]}
                            </p>
                          )}
                        </div>
                        <button
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteFile(index, onChange);
                          }}
                        >
                          <XCircleIcon className="h-5 w-5 rounded-full bg-white text-neutral-500" />
                        </button>
                      </div>
                      <div className=""></div>
                    </div>
                  ))}
                {!isLoading && (
                  <input
                    {...getInputProps()}
                    id="imageUpload"
                    className="hidden"
                    // onChange={handleFileChange}
                  />
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

export default RHFUpload;
