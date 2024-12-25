import Link from "next/link";
import type { FC, ReactNode } from "react";
import React from "react";

import type { TwMainColor } from "@/data/types";
import type { Route } from "@/routers/types";

export interface BadgeProps {
  className?: string;
  name: ReactNode;
  color?: TwMainColor;
  href?: Route<string>;
}

const Badge: FC<BadgeProps> = ({
  className = "relative",
  name,
  color = "blue",
  href,
}) => {
  const getColorClass = (hasHover = true) => {
    switch (color) {
      case "pink":
        return `text-pink-800 bg-pink-100 ${
          hasHover ? "hover:bg-pink-800" : ""
        }`;
      case "red":
        return `text-red-800 bg-red-100 ${hasHover ? "hover:bg-red-800" : ""}`;
      case "gray":
        return `text-gray-800 bg-gray-100 ${
          hasHover ? "hover:bg-gray-800" : ""
        }`;
      case "green":
        return `text-green-800 bg-green-100 ${
          hasHover ? "hover:bg-green-800" : ""
        }`;
      case "purple":
        return `text-purple-800 bg-purple-100 ${
          hasHover ? "hover:bg-purple-800" : ""
        }`;
      case "indigo":
        return `text-indigo-800 bg-indigo-100 ${
          hasHover ? "hover:bg-indigo-800" : ""
        }`;
      case "yellow":
        return `text-yellow-800 bg-yellow-100 ${
          hasHover ? "hover:bg-yellow-800" : ""
        }`;
      case "blue":
        return `text-blue-800 bg-blue-100 ${
          hasHover ? "hover:bg-blue-800" : ""
        }`;
      default:
        return `text-pink-800 bg-pink-100 ${
          hasHover ? "hover:bg-pink-800" : ""
        }`;
    }
  };

  const CLASSES = `nc-Badge px-2.5 py-1 w-max rounded-full font-medium text-xs line-clamp-1 ${className}`;
  return href ? (
    <Link
      href={href || ""}
      className={`transition-colors duration-300 hover:text-white ${CLASSES} ${getColorClass()}`}
    >
      {name}
    </Link>
  ) : (
    <span
      className={`${CLASSES} ${getColorClass(false)} ${className} leading-5`}
    >
      {name}
    </span>
  );
};

export default Badge;
