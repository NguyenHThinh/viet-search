import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import React from "react";

import { avatarColors } from "@/contains/contants";
import avatar1 from "@/images/avatars/Image-1.png";

export interface AvatarProps {
  containerClassName?: string;
  sizeClass?: string;
  radius?: string;
  imgUrl?: string | StaticImageData;
  userName?: string;
  hasChecked?: boolean;
  hasCheckedClass?: string;
}

const Avatar: FC<AvatarProps> = ({
  containerClassName = "ring-1 ring-white dark:ring-neutral-900",
  sizeClass = "h-6 w-6 text-sm",
  radius = "rounded-full",
  imgUrl = "",
  userName,
  hasChecked,
  hasCheckedClass = "w-4 h-4 -top-0.5 -right-0.5",
}) => {
  const url = imgUrl || "";
  const name = userName || "VietSearch";
  const _setBgColor = (name: string) => {
    const backgroundIndex = Math.floor(
      name.charCodeAt(0) % avatarColors.length,
    );
    return avatarColors[backgroundIndex];
  };

  return (
    <div
      className={`wil-avatar relative inline-flex shrink-0 items-center justify-center font-semibold uppercase text-neutral-100 shadow-inner ${radius} ${sizeClass} ${containerClassName}`}
      style={{ backgroundColor: url ? undefined : _setBgColor(name) }}
    >
      {url ? (
        <Image
          className={`absolute inset-0 h-full w-full object-cover ${radius}`}
          src={url}
          alt={name}
          fill
          loading="lazy"
        />
      ) : (
        <span className="wil-avatar__name">{name[0]}</span>
      )}

      {hasChecked && (
        <span
          className={` absolute flex items-center justify-center rounded-full bg-teal-500 text-xs text-white  ${hasCheckedClass}`}
        >
          <i className="las la-check" />
        </span>
      )}
    </div>
  );
};

export default Avatar;
