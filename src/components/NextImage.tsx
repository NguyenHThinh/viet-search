"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";
import type { ImageProps } from "next/image";
import Image from "next/image";
import React, { useState } from "react";

const NextImage = (props: ImageProps) => {
  const [isError, setIsError] = useState(false);

  return isError ? (
    <div
      className={`flex items-center justify-center bg-primary-50 dark:bg-neutral-700 ${props?.className}`}
    >
      <PhotoIcon className="w-1/5 text-primary-500 dark:text-neutral-200" />
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

NextImage.propTypes = {};

export default NextImage;
