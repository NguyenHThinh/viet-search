import Image from "next/image";
import React, { useEffect, useState } from "react";

interface AppImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  [key: string]: any;
}

const AppImage: React.FC<AppImageProps> = ({ src = "", alt = "", ...args }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const fallbackSrc = "/assets/img/logo-riksoft-company.png";

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={() => setImgSrc(fallbackSrc)}
      {...args}
    />
  );
};

export default AppImage;
