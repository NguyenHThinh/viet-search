"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";
import type { ImageProps } from "next/image";
import Image from "next/image";
import React, { useState } from "react";
import { IconFallbackBusiness } from "./BusinessThumbnail";

const NextBusinessImage = (props: ImageProps) => {
  const [isError, setIsError] = useState(false);

  return isError ? (
    <div
      className={`flex items-center justify-center bg-primary-50 dark:bg-neutral-700 ${props?.className}`}
    >
      {IconFallbackBusiness()}
    </div>
  ) : (
    <Image
      {...props}
      alt={props?.alt ?? "image"}
      loading="lazy"
      onError={() => {
        setIsError(true);
      }}
    />
  );
};

NextBusinessImage.propTypes = {};

export default NextBusinessImage;
