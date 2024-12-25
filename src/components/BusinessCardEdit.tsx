import Link from "next/link";
import type { FC } from "react";
import React from "react";

import BusinessBtnSaveIcon from "@/components/BusinessBtnSaveIcon";
import GallerySlider from "@/components/GallerySlider";
import Badge from "@/shared/Badge";
import { IBusiness, IBusinessCategory } from "@/models/iBusiness";
import { PATH_BUSINESS_DASHBOARD, PATH_PAGE } from "@/contains/paths";
import ShowRatingStar from "./ShowRatingStar";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { TFunction } from "i18next";
import checkOpenOrClose from "@/utils/checkOpenOrClose";
import ShowOpenState from "./ShowOpenState";
import checkOpenEmpty from "@/utils/checkOpenEmpty";

export interface BusinessCardEditProps {
  t: TFunction;
  className?: string;
  data?: IBusiness;
  size?: "default" | "small";
  lng: string;
  onAddWishlist?: (businessId: string) => void;
  onRemoveWishlist?: (businessId: string) => void;
  onDeleteBusiness?: () => void;
}

const BusinessCardEdit: FC<BusinessCardEditProps> = ({
  size = "default",
  className = "",
  data,
  lng,
  t,
  onAddWishlist,
  onRemoveWishlist,
  onDeleteBusiness,
}) => {
  const MAX_CATS = 4;
  const overCategies = data?.categories?.length
    ? data.categories.length - MAX_CATS
    : 0;

  const isShowOpenState = data?.id
    ? !!data.user_id || !checkOpenEmpty(data.open_hours)
    : false;

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full">
        <GallerySlider
          uniqueID={`BusinessCardEdit_${data?.id}`}
          ratioClass="aspect-w-12 aspect-h-11"
          galleryImgs={[
            data?.thumbnail ?? "",
            ...(data?.images
              .filter((img) => img !== data?.thumbnail)
              .slice(0, 7) ?? []),
          ]}
          imageClass="rounded-lg"
          href={PATH_BUSINESS_DASHBOARD.editBusiness(
            data?.slug ?? data?.id ?? "",
          )}
        />
        {data?.isWishlist !== undefined && (
          <BusinessBtnSaveIcon
            isLiked={data?.isWishlist}
            className="absolute right-3 top-3 z-[1]"
            businessId={data?.id ?? ""}
            onAddWishlist={onAddWishlist}
            onRemoveWishlist={onRemoveWishlist}
          />
        )}
        {/* {saleOff && <SaleOffBadge className="absolute left-3 top-3" />} */}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div
        className={`flex flex-col ${size === "default" ? "mt-3 space-y-3" : "mt-2 space-y-2"}`}
      >
        <div className="space-y-2">
          {/* <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {data?.categories} · {bedrooms} beds
          </span> */}
          <div className="flex items-center space-x-2">
            <h2
              className={`font-semibold capitalize text-neutral-900 dark:text-white ${
                size === "default" ? "text-base" : "text-base"
              }`}
            >
              <span className="line-clamp-2">
                {data?.names?.[lng] || data?.name || ""}
              </span>
            </h2>
          </div>
          {!!data?.overview_rating?.total && (
            <div className="flex items-end gap-2">
              <ShowRatingStar rating={data.overview_rating.average} />
              <p className="text-sm font-medium leading-none">
                {`${data.overview_rating.average.toFixed(1)} (${data.overview_rating.total})`}
              </p>
            </div>
          )}
          {isShowOpenState && data?.id && (
            <ShowOpenState openHour={data.open_hours} />
          )}
          <div className="flex items-center space-x-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {size === "default" && (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
            <span className="line-clamp-2">
              {data?.address?.displayed || data?.address?.country || ""}
            </span>
          </div>
        </div>
        <div className="w-14 border-b border-neutral-100 dark:border-neutral-800" />
        <div className="flex flex-wrap items-center gap-1">
          {data?.categories &&
            data?.categories?.length > 0 &&
            data?.categories
              .slice(0, MAX_CATS)
              .map((item: IBusinessCategory, index) => (
                <div key={index}>
                  <Badge
                    key={item.id}
                    name={item?.names?.[lng]}
                    color="green"
                  />
                </div>
              ))}
          {overCategies > 0 && (
            <Badge name={`+${overCategies}`} color="green" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-shadow hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900  ${className}`}
    >
      {renderSliderGallery()}
      <Link
        href={PATH_BUSINESS_DASHBOARD.editBusiness(
          data?.slug ?? data?.id ?? "",
        )}
        className="flex flex-1 px-3 pb-2"
      >
        {renderContent()}
      </Link>
      <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
      <div className="flex justify-end gap-3 p-2">
        {onDeleteBusiness && (
          <button
            className="flex w-max items-center gap-1 rounded-md border bg-red-600 px-3 py-1.5 text-neutral-200 hover:bg-opacity-90 hover:shadow-sm"
            onClick={onDeleteBusiness}
          >
            <TrashIcon className="h-5 w-5" />
            <p className="hidden sm:block lg:hidden xl:block">
              {t("common:delete")}
            </p>
          </button>
        )}
        <Link
          href={PATH_PAGE?.business.detail(data?.slug ?? data?.id ?? "")}
          className="flex w-max items-center gap-1 rounded-md border px-3 py-1.5 hover:bg-neutral-100 hover:shadow-sm dark:hover:bg-neutral-800"
        >
          <EyeIcon className="h-5 w-5" />
          <p>{t("common:viewBusiness")}</p>
        </Link>
        <Link
          href={PATH_BUSINESS_DASHBOARD.editBusiness(
            data?.slug ?? data?.id ?? "",
          )}
          className="flex w-max items-center gap-1 rounded-md border px-3 py-1.5 hover:bg-neutral-100 hover:shadow-sm dark:hover:bg-neutral-800"
        >
          <PencilSquareIcon className="h-5 w-5" />
          <p>{t("common:editBusiness")}</p>
        </Link>
      </div>
    </div>
  );
};

export default BusinessCardEdit;
