"use client";

import { useTranslation } from "@/app/i18n/client";
import { useBusinessDetail } from "@/contexts/businessDetailContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { fullFormSchema } from "@/app/[lng]/(business)/add-business/form-config";
import RHFUploadImage from "@/components/uploadImages/RHFUploadImage";
import { useCallback, useEffect, useState } from "react";
import AppImageWithLoading from "@/components/AppImageWithLoading";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { UpdateBusiness } from "@/services/business";
import ListingImage from "@/components/listing-image-gallery/ListingImage";
import { useRouter, useSearchParams } from "next/navigation";
import { PATH_PAGE } from "@/contains/paths";
import { useToast } from "@/hooks/useToast";
import { UN_UPDATE_FIELD } from "@/contains/unUpdateField";
import _ from "lodash";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const EditLogoBusinesspage = () => {
  const { showToast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams.toString());
  const { detailData, refetch } = useBusinessDetail();
  const { t } = useTranslation(["common", "addBusiness", "account"]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //
  const [isOpenGallery, setIsOpenGallery] = useState(false);
  const [listImageGallery, setListImageGallery] = useState<
    { id: number; url: string }[] | undefined
  >(undefined);

  // refactor images url for gallery
  useEffect(() => {
    const newListImageGallery = detailData?.images.map((url, index) => ({
      id: index,
      url: url ?? "",
    }));
    !newListImageGallery?.length && setIsEditing(true);
    setListImageGallery(newListImageGallery);
  }, [detailData?.images]);
  //
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(fullFormSchema(t)),
    defaultValues: {
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
      images: detailData?.images ?? [],
    },
  });

  useEffect(() => {
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
      images: detailData?.images ?? [],
    });
  }, [detailData]);

  //
  const handleSelectImage = (photoId: number) => {
    setIsOpenGallery(true);
    router.push(`?${currentParams.toString()}&photoId=${photoId}`);
  };

  //
  const onSubmit = async (data: any) => {
    if (!detailData?.id) return;

    // clear some field cant update in data update object
    const clearFormData = _.omit(data, UN_UPDATE_FIELD);

    const recaptchaToken = await getRecaptchaToken();
    setIsLoading(true);
    try {
      await UpdateBusiness(detailData.id, clearFormData, recaptchaToken);
      refetch();
      showToast("success", t("account:successUpdate"));
    } catch (error) {
      showToast(
        "error",
        <a
          href={PATH_PAGE.contact}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >{`${t("account:failUpdate")}`}</a>,
        5000,
      ); // delay 5s
    } finally {
      window.scrollTo(0, 0);
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  //
  const renderContent = useCallback(() => {
    if (isEditing) {
      return <RHFUploadImage name="images" isMultiple />;
    }

    return (
      <>
        <div className="grid grid-cols-12 gap-3">
          {detailData?.images.map((item, index) => (
            <div className="col-span-4 aspect-1 md:col-span-3" key={item}>
              <AppImageWithLoading
                src={item || ""}
                alt=""
                fill
                className="cursor-pointer rounded-lg object-cover"
                onClick={() => handleSelectImage(index)}
              />
            </div>
          ))}
        </div>
      </>
    );
  }, [detailData, isEditing]);

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">{t("addBusiness:photos")}</h2>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {!isEditing && (
        <button
          className="flex gap-2 rounded-xl border px-3 py-1.5 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-600"
          onClick={() => setIsEditing(true)}
        >
          <PencilSquareIcon className="h-5 w-5" />
          {t("common:edit")}
        </button>
      )}

      {/* ---- main content ---- */}
      <div className="w-full">
        {/* image show */}
        <ListingImage
          isShowModal={isOpenGallery}
          onClose={() => setIsOpenGallery(false)}
          images={listImageGallery}
        />
        <FormProvider {...methods}>
          {renderContent()}
          {isEditing && (
            <div className="mt-3 flex flex-row justify-end gap-3">
              <ButtonSecondary
                onClick={() => setIsEditing(false)}
                className="!py-2"
              >
                {t("common:cancel")}
              </ButtonSecondary>
              <ButtonPrimary
                loading={isLoading}
                onClick={() => onSubmit(methods.getValues())}
                className="!py-2"
              >
                {t("common:update")}
              </ButtonPrimary>
            </div>
          )}
        </FormProvider>
      </div>
    </>
  );
};

export default EditLogoBusinesspage;
