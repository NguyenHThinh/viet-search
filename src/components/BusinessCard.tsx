import Link from "next/link";
import type { FC } from "react";
import React from "react";

import BusinessBtnSaveIcon from "@/components/BusinessBtnSaveIcon";

import GallerySlider from "./GallerySlider";
import { IBusiness } from "@/models/iBusiness";
import { PATH_PAGE } from "@/contains/paths";

export interface BusinessCardProps {
  className?: string;
  data?: IBusiness;
  size?: "default" | "small";
  lng: string;
  onAddWishlist?: (businessId: string) => void;
  onRemoveWishlist?: (businessId: string) => void;
}

const BusinessCard: FC<BusinessCardProps> = ({
  size = "default",
  className = "",
  data,
  lng,
  onAddWishlist,
  onRemoveWishlist,
}) => {
  const renderSliderGallery = () => {
    return (
      <div className="relative w-full">
        <GallerySlider
          uniqueID={`BusinessCard_${data?.id}`}
          ratioClass="aspect-w-4 aspect-h-3 "
          galleryImgs={[
            data?.thumbnail ?? "",
            ...(data?.images
              .filter((img) => img !== data?.thumbnail)
              .slice(0, 7) ?? []),
          ]}
          href={PATH_PAGE?.business.detail(data?.slug ?? data?.id ?? "")}
          galleryClass={size === "default" ? undefined : ""}
        />
        {data?.isWishlist !== undefined && (
          <BusinessBtnSaveIcon
            isLiked={data?.isWishlist}
            businessId={data?.id ?? ""}
            className="absolute right-3 top-3 z-[1]"
            onAddWishlist={onAddWishlist}
            onRemoveWishlist={onRemoveWishlist}
          />
        )}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={size === "default" ? "space-y-4 p-4" : "space-y-1 p-3"}>
        <div className={size === "default" ? "space-y-2" : "space-y-1"}>
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
          <div className="flex items-center space-x-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {size === "default" && (
              <svg
                className="h-4 w-4 min-w-max"
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
            <span className="">
              {data?.address?.displayed || data?.address?.country || ""}
            </span>
          </div>
        </div>
        <div className="w-14 border-b border-neutral-100 dark:border-neutral-800" />
      </div>
    );
  };

  return (
    <div
      className={`nc-BusinessCard group relative w-full bg-white dark:bg-neutral-900 ${
        size === "default"
          ? "border border-neutral-100 dark:border-neutral-800 "
          : ""
      } overflow-hidden rounded-2xl transition-shadow hover:shadow-xl ${className}`}
      data-nc-id="BusinessCard"
    >
      {renderSliderGallery()}
      <Link href={PATH_PAGE?.business.detail(data?.slug ?? data?.id ?? "")}>
        {renderContent()}
      </Link>
    </div>
  );
};

export default BusinessCard;
