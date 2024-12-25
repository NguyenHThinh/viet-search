"use client";

import { addWishList, deleteWishList } from "@/services/wishlist";
import type { FC } from "react";
import React, { useState } from "react";

export interface BusinessBtnSaveIconProps {
  className?: string;
  colorClass?: string;
  isLiked?: boolean;
  businessId: string;
  onAddWishlist?: (businessId: string) => void;
  onRemoveWishlist?: (businessId: string) => void;
}

const BusinessBtnSaveIcon: FC<BusinessBtnSaveIconProps> = ({
  className = "",
  colorClass = "text-white bg-black bg-opacity-30 hover:bg-opacity-50",
  isLiked = false,
  businessId,
  onAddWishlist,
  onRemoveWishlist,
}) => {
  const [likedState, setLikedState] = useState(isLiked);

  const handleAddWishlist = () => {
    onAddWishlist ? onAddWishlist(businessId) : addWishList(businessId);
    setLikedState(true);
  };

  const handleRemoveWishlist = () => {
    onRemoveWishlist
      ? onRemoveWishlist(businessId)
      : deleteWishList(businessId);
    setLikedState(false);
  };

  return (
    <div
      className={`nc-BtnLikeIcon flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
        likedState ? "nc-BtnLikeIcon--liked" : ""
      }  ${colorClass} ${className}`}
      data-nc-id="BtnLikeIcon"
      title="Save"
      onClick={() =>
        likedState ? handleRemoveWishlist() : handleAddWishlist()
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={likedState ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </div>
  );
};

export default BusinessBtnSaveIcon;
