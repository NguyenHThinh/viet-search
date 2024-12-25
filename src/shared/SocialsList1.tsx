import type { FC } from "react";
import React from "react";

import type { SocialType } from "@/shared/SocialsShare";

export interface SocialsList1Props {
  className?: string;
}

const socials: SocialType[] = [
  {
    name: "Facebook",
    icon: "lab la-facebook-square",
    href: "https://facebook.com/vietsearch.org/",
  },
  {
    name: "Twitter",
    icon: "lab la-twitter",
    href: "https://twitter.com/searchviet",
  },
  {
    name: "Youtube",
    icon: "lab la-youtube",
    href: "https://www.youtube.com/channel/UCTo1d6kj3eiLmVqvF4YN-Zw",
  },
  // { name: "Instagram", icon: "lab la-instagram", href: "#" },
  {
    name: "LinkedIn",
    icon: "lab la-linkedin",
    href: "https://www.linkedin.com/company/vietsearch",
  },
];

const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-2.5" }) => {
  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        href={item.href}
        target="_blank"
        className="group flex items-center space-x-2 text-2xl leading-none text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
        key={index}
      >
        <i className={item.icon} />
        <span className="hidden text-sm lg:block">{item.name}</span>
      </a>
    );
  };

  return (
    <div className={`nc-SocialsList1 ${className}`} data-nc-id="SocialsList1">
      {socials.map(renderItem)}
    </div>
  );
};

export default SocialsList1;
