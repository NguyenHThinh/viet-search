import type { FC } from "react";
import React from "react";

import type { SocialType } from "@/shared/SocialsShare";

export interface SocialsListProps {
  className?: string;
  itemClass?: string;
  socials?: SocialType[];
}

const socialsDemo: SocialType[] = [
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

const SocialsList: FC<SocialsListProps> = ({
  className = "",
  itemClass = "block",
  socials = socialsDemo,
}) => {
  return (
    <nav
      className={`nc-SocialsList flex space-x-2.5 text-2xl text-neutral-6000 dark:text-neutral-300 ${className}`}
      data-nc-id="SocialsList"
    >
      {socials.map((item, i) => (
        <a
          key={i}
          className={`${itemClass}`}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
        >
          <i className={item.icon} />
        </a>
      ))}
    </nav>
  );
};

export default SocialsList;
