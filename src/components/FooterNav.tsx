"use client";

import {
  HeartIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

import type { PathName } from "@/routers/types";
import MenuBar from "@/shared/MenuBar";
import isInViewport from "@/utils/isInViewport";
import { useAuthContext } from "@/auth/useAuthContext";
import { PATH_PAGE, PATH_USER_DASHBOARD } from "@/contains/paths";
import { useTranslation } from "@/app/i18n/client";

let WIN_PREV_POSITION = 0;
if (typeof window !== "undefined") {
  WIN_PREV_POSITION = window.pageYOffset;
}

interface NavItem {
  name: string;
  link?: PathName;
  icon: any;
}

const FooterNav = () => {
  const { t } = useTranslation(["common"]);
  const containerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  const { isAuthenticated } = useAuthContext();

  const NAV: NavItem[] = [
    {
      name: t("common:explore"),
      link: PATH_PAGE.root,
      icon: MagnifyingGlassIcon,
    },
    {
      name: t("common:wishlist"),
      link: PATH_USER_DASHBOARD.accountWishlist,
      icon: HeartIcon,
    },
    {
      name: isAuthenticated ? t("common:myAccount") : t("common:auth.login"),
      link: PATH_USER_DASHBOARD.account,
      icon: UserCircleIcon,
    },
    {
      name: "Menu",
      icon: MenuBar,
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEvent = () => {
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(showHideHeaderMenu);
    }
  };

  const showHideHeaderMenu = () => {
    // if (typeof window === "undefined" || window?.innerWidth >= 768) {
    //   return null;
    // }

    const currentScrollPos = window.pageYOffset;
    if (!containerRef.current) return;

    // SHOW _ HIDE MAIN MENU
    if (currentScrollPos > WIN_PREV_POSITION) {
      if (
        isInViewport(containerRef.current) &&
        currentScrollPos - WIN_PREV_POSITION < 80
      ) {
        return;
      }

      containerRef.current.classList.add("FooterNav--hide");
    } else {
      if (
        !isInViewport(containerRef.current) &&
        WIN_PREV_POSITION - currentScrollPos < 80
      ) {
        return;
      }
      containerRef.current.classList.remove("FooterNav--hide");
    }

    WIN_PREV_POSITION = currentScrollPos;
  };

  const renderItem = (item: NavItem, index: number) => {
    const isActive = pathname === item.link;

    return item.link ? (
      <Link
        key={index}
        href={item.link}
        className={`flex flex-col items-center justify-between text-neutral-500 dark:text-neutral-300/90 ${
          isActive ? "text-neutral-900 dark:text-neutral-100" : ""
        }`}
      >
        <item.icon className={`h-6 w-6 ${isActive ? "text-red-600" : ""}`} />
        <span
          className={`mt-1 text-[11px] leading-none ${
            isActive ? "text-red-600" : ""
          }`}
        >
          {item.name}
        </span>
      </Link>
    ) : (
      <div
        key={index}
        className={`flex flex-col items-center justify-between text-neutral-500 dark:text-neutral-300/90 ${
          isActive ? "text-neutral-900 dark:text-neutral-100" : ""
        }`}
      >
        <item.icon iconClassName="w-6 h-6" className="" />
        <span className="mt-1 text-[11px] leading-none">{item.name}</span>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="FooterNav fixed inset-x-0 bottom-0 top-auto z-30 block border-t border-neutral-300 bg-white p-2 transition-transform duration-300 ease-in-out
      dark:border-neutral-700 dark:bg-neutral-800 md:!hidden"
    >
      <div className="mx-auto flex w-full max-w-lg justify-around text-center text-sm ">
        {/* MENU */}
        {NAV.map(renderItem)}
      </div>
    </div>
  );
};

export default FooterNav;
