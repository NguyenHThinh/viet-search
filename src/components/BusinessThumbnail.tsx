"use client";

import React, { useEffect, useState } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";

interface BussinessThumbnailProps extends ImageProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  [key: string]: any;
}

const BussinessThumbnail: React.FC<BussinessThumbnailProps> = ({
  src,
  alt,
  className,
  ...imageProps
}) => {
  const [isLoading, setIsLoading] = useState(!!src);
  const [errorImage, setErrorImage] = useState(!!!src);

  return (
    <div
      className={`relative h-full w-full ${errorImage && "flex items-center justify-center rounded-lg bg-primary-50 dark:bg-neutral-700"}`}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-500"></div>
      )}
      {src && !errorImage && (
        <Image
          src={src}
          alt={alt}
          loading="lazy"
          {...imageProps}
          className={`transition-opacity duration-[2s] ${isLoading ? "opacity-0" : "opacity-100"} ${className}`}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setErrorImage(true);
          }}
        />
      )}
      {errorImage && IconFallbackBusiness()}
    </div>
  );
};

export function IconFallbackBusiness() {
  return (
    <svg
      className="w-1/5 text-primary-500 dark:text-primary-200"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 22H5C3 22 2 21 2 19V11C2 9 3 8 5 8H10V19C10 21 11 22 13 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.11 4C10.03 4.3 10 4.63 10 5V8H5V6C5 4.9 5.9 4 7 4H10.11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 8V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 8V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 17H15C14.45 17 14 17.45 14 18V22H18V18C18 17.45 17.55 17 17 17Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 13V17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 19V5C10 3 11 2 13 2H19C21 2 22 3 22 5V19C22 21 21 22 19 22H13C11 22 10 21 10 19Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BussinessThumbnail;
