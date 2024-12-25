import Link from "next/link";
import type { FC } from "react";
import React from "react";

import GallerySlider from "@/components/GallerySlider";
import SaleOffBadge from "@/components/SaleOffBadge";
import Badge from "@/shared/Badge";
import { IBusiness, IBusinessCategory } from "@/models/iBusiness";
import ShowRatingStar from "./ShowRatingStar";
import { PATH_PAGE } from "@/contains/paths";
import BusinessBtnSaveIcon from "./BusinessBtnSaveIcon";
import ShowOpenState from "./ShowOpenState";
import checkOpenEmpty from "@/utils/checkOpenEmpty";
import { MapPinIcon } from "@heroicons/react/24/outline";

export interface ListTypePropertyCardProps {
  className?: string;
  data: IBusiness;
  lng: string;
  onAddWishlist?: (businessId: string) => void;
  onRemoveWishlist?: (businessId: string) => void;
}

const ListTypePropertyCard: FC<ListTypePropertyCardProps> = ({
  className = "",
  data,
  lng,
  onAddWishlist,
  onRemoveWishlist,
}) => {
  const isShowOpenState = data?.id
    ? !!data.user_id || !checkOpenEmpty(data.open_hours)
    : false;

  const renderSliderGallery = () => {
    return (
      <div className="w-full shrink-0 p-3 sm:w-64 ">
        <GallerySlider
          ratioClass="aspect-w-1 aspect-h-1"
          galleryImgs={[
            data?.thumbnail ?? "",
            ...(data?.images
              .filter((img) => img !== data?.thumbnail)
              .slice(0, 7) ?? []),
          ]}
          className="h-full w-full overflow-hidden rounded-2xl"
          uniqueID={`ListTypePropertyCard_${data?.id}`}
          href={data?.slug}
        />
      </div>
    );
  };

  const renderTienIch = () => {
    return (
      <div className="inline-grid grid-cols-3 gap-2">
        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-block">
            <i className="las la-bed text-lg" />
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            6 beds
          </span>
        </div>

        {/* ---- */}
        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-block">
            <i className="las la-bath text-lg" />
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            3 baths
          </span>
        </div>

        {/* ---- */}
        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-block">
            <i className="las la-expand-arrows-alt text-lg" />
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            1200 Sq. Fit
          </span>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="flex grow flex-col items-start p-3 sm:pr-6">
        <div className="w-full space-y-4">
          <div className="flex items-center space-x-2">
            {/* {isAds && <Badge name="ADS" color="green" />} */}
            <h2 className="max-w-[95%] text-lg font-medium capitalize">
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
          <div className="flex flex-row items-center gap-1 text-neutral-500 dark:text-neutral-400">
            <MapPinIcon className="h-5 w-5 min-w-max" />
            <span className="line-clamp-2 text-sm">
              {data?.address?.displayed || data?.address?.country || ""}
            </span>
          </div>
          {/* {renderTienIch()} */}
          <div className="w-14 border-b border-neutral-200/80 dark:border-neutral-700 " />
          <div className="flex flex-1 flex-wrap items-center gap-1">
            {data?.categories &&
              data?.categories?.length > 0 &&
              data?.categories.map((item: IBusinessCategory) => (
                <Badge key={item.id} name={item?.names?.[lng]} color="green" />
              ))}
          </div>
          <div className="flex w-full items-end justify-between">
            {/* {!!data?.rating && (
              <BusinessStartRating reviewCount={0} point={data?.rating} />
            )} */}
            {/* <span className="flex items-center justify-center rounded-lg border-2 border-secondary-500 px-2.5 py-1.5 text-sm font-medium leading-none text-secondary-500">
              {`${price},000`}
            </span> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-ListTypePropertyCard group relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
    >
      <Link
        href={PATH_PAGE?.business.detail(data?.slug ?? data?.id ?? "")}
        className="absolute inset-0"
      />
      <div className="flex h-full w-full flex-col sm:flex-row sm:items-start">
        {renderSliderGallery()}
        {renderContent()}
      </div>
      {data?.isWishlist !== undefined && (
        <BusinessBtnSaveIcon
          isLiked={data?.isWishlist}
          className="absolute right-3 top-3 z-[1]"
          businessId={data?.id ?? ""}
          onAddWishlist={onAddWishlist}
          onRemoveWishlist={onRemoveWishlist}
        />
      )}
    </div>
  );
};

export default ListTypePropertyCard;
