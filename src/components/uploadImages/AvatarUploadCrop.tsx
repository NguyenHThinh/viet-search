"use client";

import { useCallback, useState } from "react";
import ButtonSecondary from "@/shared/ButtonSecondary";
import CropPopup from "@/components/uploadImages/CropPopup";
import getCroppedImg from "@/utils/cropImage";
import { uploadImages } from "@/services/storageImg";
import AppImageWithLoading from "@/components/AppImageWithLoading";
import { useTranslation } from "@/app/i18n/client";
import { useDropzone } from "react-dropzone";

interface AvatarUploadCropProps {
  avatar: string;
  onImageChange: (url: string) => void;
}

const AvatarUploadCrop: React.FC<AvatarUploadCropProps> = ({
  avatar,
  onImageChange,
}) => {
  const { t } = useTranslation(["addBusiness", "common"]);

  //
  const [showImage, setShowImage] = useState<string>(avatar || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [croppedArea, setCroppedArea] = useState<any>(null);

  // Handle the crop complete event
  const handleCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedArea(croppedAreaPixels);
    },
    [],
  );

  // Handle the image upload
  const handleUpload = async (
    selectedFiles: File[],
    onChange: (value: string[]) => void,
  ) => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("images", selectedFiles[0]);

    try {
      const response = await uploadImages(formData);
      const imageUrls = response.map((img: { url: string }) => img?.url ?? "");
      await onChange(imageUrls);
      setShowImage(imageUrls[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save cropped image
  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedArea) return;

    setIsLoading(true);
    try {
      const croppedImageFile = await getCroppedImg(imageSrc, croppedArea);
      if (!croppedImageFile) throw new Error("Cropped image file is null");

      await handleUpload([croppedImageFile], (url) => {
        onImageChange(url[0]);
      });
    } catch (error) {
      console.error("Error saving cropped image:", error);
    } finally {
      setIsLoading(false);
      setIsCropping(false);
    }
  };

  // Handle image selection for cropping
  const handleFileChange = (files: File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop setup using react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileChange(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  return (
    <>
      <div className="mx-auto aspect-1 w-1/3">
        {showImage ? (
          <AppImageWithLoading
            src={showImage || ""}
            alt=""
            fill
            className="rounded-lg border object-cover"
          />
        ) : (
          <div
            className="relative flex h-full w-full border-collapse cursor-pointer flex-col items-center justify-center rounded-lg border"
            {...getRootProps()}
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input accept="image/*" {...getInputProps()} />
            <p>{t("common:uploadImage")}</p>
          </div>
        )}
      </div>
      <div className="mx-auto mt-4 w-max space-x-3">
        {showImage && (
          <label
            htmlFor="fileInput"
            className="cursor-pointer rounded-full border px-4 py-2 font-semibold text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {t("addBusiness:changeLogo")}
          </label>
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
        />
      </div>
      <CropPopup
        isLoading={isLoading}
        isCropping={isCropping}
        handleCropComplete={handleCropComplete}
        handleSaveCrop={handleSaveCrop}
        imageSrc={imageSrc}
        setIsCropping={setIsCropping}
      />
    </>
  );
};

export default AvatarUploadCrop;
