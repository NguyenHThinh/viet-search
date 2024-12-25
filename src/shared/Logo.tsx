import type { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

import logoImg from "@/images/logo.png";
import logoLightImg from "@/images/logo-light.png";

import LogoSvg from "./LogoSvg";
import LogoSvgLight from "./LogoSvgLight";
import NextImage from "@/components/NextImage";

export interface LogoProps {
  img?: StaticImageData;
  imgLight?: StaticImageData;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  img = logoImg,
  imgLight = logoLightImg,
  className = "w-24",
}) => {
  return (
    <Link
      href="/"
      className={`ttnc-logo inline-block text-primary-6000 focus:outline-none focus:ring-0 ${className}`}
    >
      {/*<LogoSvgLight />*/}
      {/*<LogoSvg />*/}
      {/* <div className={"block max-h-12"}> */}
      <NextImage
        src={
          "https://s3.amazonaws.com/static.vietsearch.org/images/logo-color.png"
        }
        alt={"logo"}
        width={200}
        height={263}
        loading={"lazy"}
      />

      {/* </div> */}

      {/* THIS USE FOR MY CLIENT */}
      {/* PLEASE UN COMMENT BELLOW CODE AND USE IT */}
      {/* {img ? (
        <img
          className={`block max-h-12 ${imgLight ? "dark:hidden" : ""}`}
          src={img}
          alt="Logo"
        />
      ) : (
        "Logo Here"
      )}
      {imgLight && (
        <img
          className="hidden max-h-12 dark:block"
          src={imgLight}
          alt="Logo-Light"
        />
      )} */}
    </Link>
  );
};

export default Logo;
