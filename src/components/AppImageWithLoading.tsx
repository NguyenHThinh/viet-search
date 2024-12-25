"use client";

import React, { useEffect, useState } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface AppImageWithLoadingProps extends ImageProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  [key: string]: any;
}

const AppImageWithLoading: React.FC<AppImageWithLoadingProps> = ({
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
      {errorImage && (
        <PhotoIcon className="w-1/5 text-primary-500 dark:text-primary-200" />
      )}
    </div>
  );
};

export default AppImageWithLoading;
