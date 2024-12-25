"use client";

import { useTranslation } from "@/app/i18n/client";
import { useBusinessDetail } from "@/contexts/businessDetailContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { fullFormSchema } from "@/app/[lng]/(business)/add-business/form-config";
import { useCallback, useEffect, useState } from "react";
import AppImageWithLoading from "@/components/AppImageWithLoading";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { uploadImages } from "@/services/storageImg";
import getCroppedImg from "@/utils/cropImage";
import CropPopup from "@/components/uploadImages/CropPopup";
import { UpdateBusiness } from "@/services/business";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";
import { PATH_PAGE } from "@/contains/paths";
import { UN_UPDATE_FIELD } from "@/contains/unUpdateField";
import _ from "lodash";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const EditLogoBusinesspage = () => {
  const { showToast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();
  const { detailData, setDetailData } = useBusinessDetail();
  const { t, i18n } = useTranslation(["addBusiness", "account"]);
  const [isLoading, setIsLoading] = useState(false);

  //
  const [isCropping, setIsCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [croppedArea, setCroppedArea] = useState<any>(null);

  //
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(fullFormSchema(t)),
    defaultValues: {
      ...detailData,
      categories: detailData?.categories.map((item) => item?.id) ?? [],
      address: {
        displayed: detailData?.address?.displayed ?? "",
        zipcode: detailData?.address?.zipcode ?? "",
        country: detailData?.address?.country ?? "",
        state: detailData?.address?.state ?? "",
        street: detailData?.address?.street ?? "",
      },
      thumbnail: detailData?.thumbnail ?? "",
    },
  });

  useEffect(() => {
    setImageSrc(detailData?.thumbnail ?? "");

    methods.reset({
      ...detailData,
      // refactor some field
      categories: detailData?.categories.map((item) => item?.id) ?? [],
      address: {
        displayed: detailData?.address?.displayed ?? "",
        zipcode: detailData?.address?.zipcode ?? "",
        country: detailData?.address?.country ?? "",
        state: detailData?.address?.state ?? "",
        street: detailData?.address?.street ?? "",
      },
      // update field
      thumbnail: detailData?.thumbnail ?? "",
    });
  }, [detailData]);

  // handle upload file on storage api server
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

      // clean array image
      const updatedImages = [imageUrls[0]];

      // wait form thumbnail data change
      await onChange(updatedImages);

      // submit form
      await onSubmit(methods.getValues());
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
        methods.setValue("thumbnail", url[0]);
      });
    } catch (error) {
      console.error("Error saving cropped image:", error);
    } finally {
      setIsLoading(false);
      setIsCropping(false);
    }
  };

  //
  const onSubmit = async (data: any) => {
    if (!detailData?.id) return;

    // clear some field cant update in data update object
    const clearFormData = _.omit(data, UN_UPDATE_FIELD);
    const recaptchaToken = await getRecaptchaToken();

    try {
      const response = await UpdateBusiness(
        detailData.id,
        clearFormData,
        recaptchaToken,
      );
      showToast("success", t("account:successUpdate"));
      // refetch();
      setDetailData(response);
    } catch (error) {
      console.error(error);
      showToast(
        "error",
        <Link
          href={PATH_PAGE.contact}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >{`${t("account:failUpdate")}`}</Link>,
        5000,
      ); // delay 5s
    } finally {
      window.scrollTo(0, 0);
    }
  };

  const renderContent = useCallback(() => {
    return (
      <>
        <div className="mx-auto aspect-1 w-1/3">
          <AppImageWithLoading
            src={detailData?.thumbnail || ""}
            alt=""
            fill
            className="rounded-lg border object-cover"
          />
        </div>
        <div className="mx-auto mt-4 w-max space-x-3">
          <ButtonSecondary
            className="!py-2 text-sm font-semibold"
            // triggle upload input
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {t("addBusiness:changeLogo")}
          </ButtonSecondary>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
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
        </div>
      </>
    );
  }, [detailData]);

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">{t("addBusiness:logo")}</h2>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      {/* ---- main content ---- */}
      <div className="w-full">
        <FormProvider {...methods}>{renderContent()}</FormProvider>
      </div>

      {/* crop popup */}
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

export default EditLogoBusinesspage;
