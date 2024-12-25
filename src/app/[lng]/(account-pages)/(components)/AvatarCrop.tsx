"use client";

import { useAuthContext } from "@/auth/useAuthContext";
import CropPopup from "@/components/uploadImages/CropPopup";
import { uploadImages } from "@/services/storageImg";
import Avatar from "@/shared/Avatar";
import getCroppedImg from "@/utils/cropImage";
import React, { FC, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";

interface AvatarCropProps {
  onImageChange: (url: string) => void;
}

const AvatarCrop: FC<AvatarCropProps> = ({ onImageChange }) => {
  const { user } = useAuthContext();
  const { setValue, getValues } = useFormContext();

  //
  const [isLoading, setIsLoading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [showAvatarUser, setShowAvatarUser] = useState<string>(
    user?.avatar || "",
  );
  const [imageSrc, setImageSrc] = useState<string>("");
  const [croppedArea, setCroppedArea] = useState<any>(null);

  const handleUpload = async (
    selectedFiles: File[],
    onChange: (value: string[]) => void,
  ) => {
    if (selectedFiles.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append("images", selectedFiles[0]);

    try {
      const response = await uploadImages(formData);

      // Extract URLs from the response and pass them to onImagesChange
      const imageUrls = response.map(
        (img: { height: number; width: number; url: string; key: string }) =>
          img?.url ?? "",
      );

      setShowAvatarUser(imageUrls[0]);

      // clean array image
      const updatedImages = [imageUrls[0]];

      // wait form thumbnail data change
      await onChange(updatedImages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //
  const handleCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedArea(croppedAreaPixels);
    },
    [],
  );

  // handle when click save in popup crop
  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedArea) return;

    setIsLoading(true);
    try {
      const croppedImageFile = await getCroppedImg(imageSrc, croppedArea);

      if (!croppedImageFile) {
        throw new Error("Cropped image file is null");
      }

      await handleUpload([croppedImageFile], (url) => {
        setValue("avatar", url[0]);
      });
    } catch (error) {
      console.error("Error saving cropped image:", error);
    } finally {
      setIsLoading(false);
      setIsCropping(false);
    }
  };

  return (
    <div>
      <Avatar
        sizeClass="w-32 h-32"
        imgUrl={showAvatarUser}
        userName={user?.name}
      />
      <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black bg-opacity-60 text-neutral-50">
        <svg
          width="30"
          height="30"
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

        <span className="mt-1 text-xs">Change Image</span>
      </div>
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              setImageSrc(reader.result as string);
              setIsCropping(true);
            };
            reader.readAsDataURL(file);
          }
        }}
      />
      {/* crop popup */}
      <CropPopup
        isLoading={isLoading}
        isCropping={isCropping}
        handleCropComplete={handleCropComplete}
        handleSaveCrop={handleSaveCrop}
        imageSrc={imageSrc}
        setIsCropping={setIsCropping}
      />
    </div>
  );
};

export default AvatarCrop;
