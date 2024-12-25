"use client";

import { Controller, FieldErrorsImpl, useFormContext } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import _ from "lodash";
import RHFTextField from "@/components/RHFTextField";
import Textarea from "@/shared/Textarea";
import KeywordsField from "../../../add-business/components/KeywordsField";
import Badge from "@/shared/Badge";
import AddCatsForm from "../../../add-business/components/AddCatsForm";
import { iFormSchema } from "../../../add-business/form-config";
import Input from "@/shared/Input";
import AddContact from "../../../add-business/components/AddContact";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { UpdateBusiness } from "@/services/business";
import { APP_CONFIGS } from "@/config-global";
import { useBusinessDetail } from "@/contexts/businessDetailContext";
import {
  BUSINESS_TYPE,
  BUSINESS_TYPE_SHOWER,
  BusinessTypeKey,
  BusinessTypeShowerKey,
} from "@/constants/business";
import { useToast } from "@/hooks/useToast";
import { PATH_PAGE } from "@/contains/paths";
import parse from "html-react-parser";
import { DescriptionDetail } from "../../(business-detail)/(components)/DescriptionDetail";
import { linkify } from "@/utils/general";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const FormEdit = () => {
  const { showToast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();
  const { detailData, refetch } = useBusinessDetail();
  const { t, i18n } = useTranslation(["common", "addBusiness", "account"]);
  const {
    setValue,
    getValues,
    register,
    clearErrors,
    reset,
    formState: { errors },
    control,
  } = useFormContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowDescription, setIsShowDescription] = useState(false);
  const [isOverFlowDesc, setIsOverFlowDesc] = useState(false);

  const descriptionRef = useRef<HTMLDivElement>(null);

  const handleChangeDesc = () => {
    setIsShowDescription((prev) => !prev);
    {
      isShowDescription &&
        descriptionRef.current &&
        descriptionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  };

  // check content overflow height
  useEffect(() => {
    const element = descriptionRef.current;
    if (element) {
      setIsOverFlowDesc(element.scrollHeight > element.clientHeight);
    }
  }, [detailData?.description]);

  if (!detailData?.id) {
    return <></>;
  }

  const handleEditClick = () => {
    setIsEditing(true);

    // set detail data into form data
    reset({
      name: detailData?.name ?? "",
      types: detailData?.types ?? ["company"],
      description:
        detailData?.description ??
        detailData?.descriptions?.[i18n.language] ??
        "",
      descriptions: detailData?.descriptions ?? {},
      keywords: detailData?.keywords ?? [],
      categories: detailData?.categories.map((item) => item?.id) ?? [],
      contacts: detailData?.contacts ?? [{ type: "website", value: "" }],
      address: {
        displayed: detailData?.address?.displayed ?? "",
        zipcode: detailData?.address?.zipcode ?? "",
        country: detailData?.address?.country ?? "",
        state: detailData?.address?.state ?? "",
        street: detailData?.address?.street ?? "",
      },
    });
  };

  const onSubmit = async (data: any) => {
    const recaptchaToken = await getRecaptchaToken();
    setIsLoading(true);
    try {
      await UpdateBusiness(detailData.id, data, recaptchaToken);
      await refetch();
      showToast("success", t("account:successUpdate"));
      localStorage.removeItem(APP_CONFIGS.catsbusinessValue);
    } catch (error) {
      console.error(error);
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

  const renderTypeText = (type: string) => {
    // get key-value with value equal type
    const transKeyEntry = Object.entries(BUSINESS_TYPE_SHOWER).find(
      ([key, val]) => val === type,
    );
    // transKeyEntry return [key, value]
    const transKey = transKeyEntry
      ? (transKeyEntry[0] as BusinessTypeShowerKey)
      : null;

    return <p>{transKey ? t(`addBusiness:types.${transKey}`) : ""}</p>;
  };

  const renderContactType = (type: string) => {
    switch (type) {
      case "homepage":
        return (
          <p className="col-span-2">{t("addBusiness:contactTypes.website")}:</p>
        );
      case "website":
        return (
          <p className="col-span-2">{t("addBusiness:contactTypes.website")}:</p>
        );
      case "mobile":
        return (
          <p className="col-span-2">{t("addBusiness:contactTypes.mobile")}:</p>
        );
      case "fax":
        return (
          <p className="col-span-2">{t("addBusiness:contactTypes.fax")}:</p>
        );
      case "xcom":
        return (
          <p className="col-span-2">{t("addBusiness:contactTypes.xcom")}:</p>
        );
      case "phone":
        return (
          <p className="col-span-2">{t("addBusiness:contactTypes.phone")}:</p>
        );
      case "email":
        return (
          <p className="col-span-2">{t("addBusiness:contactTypes.email")}:</p>
        );
      case "facebook":
        return (
          <p className="col-span-2">
            {t("addBusiness:contactTypes.facebook")}:
          </p>
        );
      case "linkedin":
        return (
          <p className="col-span-2">
            {t("addBusiness:contactTypes.linkedin")}:
          </p>
        );
      case "other":
        return (
          <p className="col-span-2">{t("addBusiness:contactTypes.other")}:</p>
        );
      default:
        return;
    }
  };

  const renderContactValue = (type: string, value: string) => {
    switch (type) {
      case "homepage":
        return (
          <a
            href={linkify(value)}
            target="_blank"
            className="ml-3 w-full truncate text-blue-500 underline hover:no-underline md:col-span-10 md:ml-0"
          >
            {value}
          </a>
        );
      case "website":
        return (
          <a
            href={linkify(value)}
            target="_blank"
            className="ml-3 w-full truncate text-blue-500 underline hover:no-underline md:col-span-10 md:ml-0"
          >
            {value}
          </a>
        );
      case "mobile":
        return (
          <a
            href={value}
            target="_blank"
            className="ml-3 text-blue-500 underline hover:no-underline md:col-span-10 md:ml-0"
          >
            {value}
          </a>
        );
      case "fax":
        return (
          <p className="ml-3 w-full truncate text-blue-500 underline hover:no-underline md:col-span-10 md:ml-0">
            {value}
          </p>
        );
      case "xcom":
        return (
          <a
            href={linkify(value)}
            target="_blank"
            className="ml-3 text-blue-500 underline hover:no-underline md:col-span-10 md:ml-0"
          >
            {value}
          </a>
        );
      case "phone":
        return (
          <a
            href={`tel:${value}`}
            className="ml-3 w-max text-blue-500 underline hover:no-underline md:col-span-10 md:ml-0"
          >
            {value}
          </a>
        );
      case "email":
        return (
          <a
            href={`mailto:${value}`}
            className="ml-3 w-full truncate text-blue-500 underline hover:no-underline md:col-span-10 md:ml-0"
          >
            {value}
          </a>
        );
      case "facebook":
        return (
          <a
            href={linkify(value)}
            target="_blank"
            className="ml-3 w-full truncate text-blue-500 underline hover:no-underline md:col-span-10 md:ml-0"
          >
            {value}
          </a>
        );
      case "linkedin":
        return (
          <a
            href={linkify(value)}
            target="_blank"
            className="ml-3 w-full truncate text-blue-500 underline hover:no-underline md:col-span-10 md:ml-0"
          >
            {value}
          </a>
        );
      case "other":
        return (
          <p className="ml-3 w-full truncate text-blue-500 underline hover:no-underline md:col-span-10 md:ml-0">
            {value}
          </p>
        );
      default:
        return;
    }
  };

  const renderTypes = () => (
    <div
      className={`grid grid-cols-4 ${isEditing ? "items-center" : ""} gap-4`}
    >
      <p className="col-span-1">{t("addBusiness:type")}:</p>
      <div className="col-span-3">
        {isEditing ? (
          <>
            <Controller
              name="types"
              control={control}
              defaultValue={getValues("types") || []}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value[0] ?? ""}
                  onChange={(e) => {
                    field.onChange([e.target.value]);
                  }}
                  onFocus={() => clearErrors("types")}
                  className="block h-11 w-max rounded-2xl border-neutral-200 bg-white text-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25"
                >
                  {Object.keys(BUSINESS_TYPE).map((key) => {
                    const typedKey = key as BusinessTypeKey;
                    return (
                      <option
                        key={typedKey}
                        value={BUSINESS_TYPE[typedKey] || ""}
                      >
                        {t(`addBusiness:types.${typedKey}`) ?? ""}
                      </option>
                    );
                  })}
                </select>
              )}
            />
            {errors?.types && (
              <p className="ml-1 mt-1 text-sm text-red-500">
                {String(errors?.types?.message) ||
                  t("addBusiness:error.missingField")}
              </p>
            )}
          </>
        ) : (
          renderTypeText(detailData?.types?.[0])
        )}
      </div>
    </div>
  );

  const renderName = () => (
    <div
      className={`grid grid-cols-4 ${isEditing ? "items-center" : ""} gap-4`}
    >
      <p className="col-span-1">{t("addBusiness:name")}:</p>
      <div className="col-span-3">
        {isEditing ? (
          <RHFTextField
            name="name"
            required
            placeholder={t("addBusiness:step1.businessName")}
          />
        ) : detailData?.names?.[i18n.language] || detailData.name ? (
          <p>{detailData?.names?.[i18n.language] || detailData.name}</p>
        ) : (
          <p>{t("common:null")}</p>
        )}
      </div>
    </div>
  );

  const renderDescription = () => (
    <div className="grid grid-cols-4 gap-4">
      <p className="col-span-1">{t("addBusiness:description")}:</p>
      <div className="col-span-3">
        {isEditing ? (
          <>
            <Textarea
              {...register("description")}
              placeholder={t("addBusiness:step1.describe")}
              rows={8}
              className={errors?.description && "border-red-500"}
              onFocus={(e) => {
                clearErrors("description");
              }}
              onChange={(e) => {
                const value = e.target.value;
                console.log(value);
                // Set the main field and duplicate its value to other fields
                setValue("description", value);
                setValue("descriptions.en", value);
                setValue("descriptions.vi", value);
              }}
            />
            {errors?.description && (
              <p className="ml-1 mt-1 text-sm text-red-500">
                {String(errors?.description?.message) ||
                  t("addBusiness:error.missingField")}
              </p>
            )}
          </>
        ) : detailData?.description ||
          detailData?.descriptions?.[i18n.language] ? (
          <>
            <div
              className={`relative overflow-hidden text-neutral-6000 dark:text-neutral-300 ${isShowDescription ? "h-max" : "max-h-80"}`}
              ref={descriptionRef}
            >
              {parse(detailData.description)}
              {!isShowDescription && isOverFlowDesc && (
                <div className="absolute bottom-0 h-5 w-full bg-gradient-to-t from-neutral-50 to-transparent"></div>
              )}
            </div>

            {isOverFlowDesc && (
              <button
                className="mx-auto mt-2 flex w-max flex-row items-center gap-1 rounded-lg border px-3 py-1.5 underline hover:no-underline"
                onClick={handleChangeDesc}
              >
                {isShowDescription ? t("common:hidden") : t("common:seeAll")}
                {isShowDescription ? (
                  <ChevronUpIcon className="ml-1 h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-5 w-5" />
                )}
              </button>
            )}
          </>
        ) : (
          <p>{t("common:null")}</p>
        )}
      </div>
    </div>
  );

  const renderKeywords = () => (
    <div
      className={`grid grid-cols-4 ${isEditing ? "items-center" : ""} gap-4`}
    >
      <p className="col-span-1">{t("addBusiness:keyWords")}:</p>
      <div className="col-span-3">
        {isEditing ? (
          <KeywordsField hasLabel={false} />
        ) : (
          <div className="flex flex-row items-center gap-1">
            {detailData?.keywords?.length > 0 ? (
              detailData?.keywords.map((item, index) => (
                <div key={index}>
                  <Badge name={item} />
                </div>
              ))
            ) : (
              <p>{t("common:null")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div
      className={`grid grid-cols-4 ${isEditing ? "items-center" : ""} gap-4`}
    >
      <p className="col-span-1">{t("addBusiness:categories")}:</p>
      <div className="col-span-3">
        {isEditing ? (
          <AddCatsForm
            hasLabel={false}
            defaultValue={detailData.categories.map(
              (i) => i?.names?.[i18n.language],
            )}
          />
        ) : (
          <div className="flex flex-row items-center gap-1">
            {detailData?.categories?.length > 0 ? (
              detailData?.categories.map((item, index) => (
                <div key={index}>
                  <Badge name={item?.names?.[i18n.language]} />
                </div>
              ))
            ) : (
              <p>{t("common:null")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderFullAddress = () => (
    <div
      className={`grid grid-cols-4 ${isEditing ? "items-center" : ""} gap-4`}
    >
      <p className="col-span-1">{t("addBusiness:step2.fullAddress")}:</p>
      <div className="col-span-3">
        {isEditing ? (
          <>
            <Controller
              name="address.displayed"
              control={control}
              defaultValue={getValues("address.displayed") || []}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value}
                  placeholder={t("addBusiness:step2.exampleAddress")}
                  onFocus={() => {
                    clearErrors("address.displayed");
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />
              )}
            />
            {(errors.address as FieldErrorsImpl<iFormSchema["address"]>)
              ?.displayed && (
              <p className="ml-1 mt-1 text-sm text-red-500">
                {String(
                  (errors.address as FieldErrorsImpl<iFormSchema["address"]>)
                    ?.displayed?.message,
                ) || t("addBusiness:error.missingField")}
              </p>
            )}
          </>
        ) : detailData?.address.displayed ? (
          <p>{detailData?.address.displayed}</p>
        ) : (
          <p>{t("common:null")}</p>
        )}
      </div>
    </div>
  );

  const renderAddressStreet = () => (
    <div
      className={`grid grid-cols-4 ${isEditing ? "items-center" : ""} gap-4`}
    >
      <p className="col-span-1">{t("addBusiness:step2.street")}:</p>
      <div className="col-span-3">
        {isEditing ? (
          <Controller
            name="address.street"
            control={control}
            defaultValue={getValues("address.street") || []}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value}
                onFocus={() => {
                  clearErrors("address.street");
                }}
                onChange={(e) => {
                  field.onChange(e);
                }}
              />
            )}
          />
        ) : detailData?.address?.street ? (
          <p>{detailData?.address.street}</p>
        ) : (
          <p>{t("common:null")}</p>
        )}
      </div>
    </div>
  );

  const renderAddressState = () => (
    <div
      className={`grid grid-cols-4 ${isEditing ? "items-center" : ""} gap-4`}
    >
      <p className="col-span-1">{t("addBusiness:step2.state")}:</p>
      <div className="col-span-3">
        {isEditing ? (
          <Controller
            name="address.state"
            control={control}
            defaultValue={getValues("address.state") || []}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value}
                onFocus={() => {
                  clearErrors("address.state");
                }}
                onChange={(e) => {
                  field.onChange(e);
                }}
              />
            )}
          />
        ) : detailData?.address?.state ? (
          <p>{detailData?.address.state}</p>
        ) : (
          <p>{t("common:null")}</p>
        )}
      </div>
    </div>
  );

  const renderAddressPostalcode = () => (
    <div
      className={`grid grid-cols-4 ${isEditing ? "items-center" : ""} gap-4`}
    >
      <p className="col-span-1">{t("addBusiness:step2.postalCode")}:</p>
      <div className="col-span-3">
        {isEditing ? (
          <Controller
            name="address.zipcode"
            control={control}
            defaultValue={getValues("address.zipcode") || []}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value}
                onFocus={() => {
                  clearErrors("address.zipcode");
                }}
                onChange={(e) => {
                  field.onChange(e);
                }}
              />
            )}
          />
        ) : detailData?.address?.zipcode ? (
          <p>{detailData?.address?.zipcode}</p>
        ) : (
          <p>{t("common:null")}</p>
        )}
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="grid grid-cols-4 gap-4">
      <p className="col-span-1">{t("addBusiness:stepTitle.contacts")}:</p>
      <div className="col-span-3">
        {isEditing ? (
          <AddContact hasLabel={false} />
        ) : (
          <div className="space-y-3">
            {detailData?.contacts?.length > 0 ? (
              detailData?.contacts.map((item, index) => (
                <div key={index} className="md:grid md:grid-cols-12 md:gap-3">
                  {renderContactType(item.type)}
                  {renderContactValue(item.type, item.value)}
                </div>
              ))
            ) : (
              <p>{t("common:null")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-xl font-semibold">{t("addBusiness:basicInfo")}</h3>
        {isEditing ? (
          <div className="mt-3 flex flex-row justify-end gap-3">
            <ButtonSecondary
              onClick={() => setIsEditing(false)}
              className="!py-2"
            >
              {t("common:cancel")}
            </ButtonSecondary>
            <ButtonPrimary
              loading={isLoading}
              onClick={() => onSubmit(getValues())}
              className="!py-2"
            >
              {t("common:saveUpdate")}
            </ButtonPrimary>
          </div>
        ) : (
          <button
            className="flex gap-2 rounded-xl border px-3 py-1.5 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-600"
            onClick={handleEditClick}
          >
            <PencilSquareIcon className="h-5 w-5" />
            {t("common:edit")}
          </button>
        )}
      </div>

      {/* form content */}
      <div className="my-4 space-y-4">
        {renderTypes()}
        {renderName()}
        {renderDescription()}
        {renderKeywords()}
        {renderCategories()}
        {renderFullAddress()}
        {renderAddressStreet()}
        {renderAddressState()}
        {renderAddressPostalcode()}
        {renderContacts()}
      </div>

      {isEditing && (
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
      )}
      {/* control submit */}
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
            onClick={() => onSubmit(getValues())}
            className="!py-2"
          >
            {t("common:saveUpdate")}
          </ButtonPrimary>
        </div>
      )}
    </>
  );
};

export default FormEdit;
