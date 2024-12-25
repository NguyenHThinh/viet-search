"use client";

import { useTranslation } from "@/app/i18n/client";
import { useAuthContext } from "@/auth/useAuthContext";
import { PATH_USER_DASHBOARD } from "@/contains/paths";
import Avatar from "@/shared/Avatar";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC } from "react";
import {
  IconHeart,
  IconImage,
  IconLock,
  IconReview,
  IconUser,
} from "./IconsNavbar";

export interface SideBarItem {
  name: string;
  url: string;
  icon?: any;
}

const SIDEBAR_DATA: SideBarItem[] = [
  {
    name: "Account",
    url: PATH_USER_DASHBOARD.account,
    icon: IconUser(),
  },
  {
    name: "Account Wishlist",
    url: PATH_USER_DASHBOARD.accountWishlist,
    icon: IconHeart(),
  },
  {
    name: "Account Password",
    url: PATH_USER_DASHBOARD.accountPassword,
    icon: IconLock(),
  },
  {
    name: "Reviews",
    url: PATH_USER_DASHBOARD.accountReviews,
    icon: IconReview(),
  },
  {
    name: "Photos",
    url: PATH_USER_DASHBOARD.accountPhotos,
    icon: IconImage(),
  },
];

interface SideBarProps {
  sidebarData: SideBarItem[];
  showUserInfo?: boolean;
}

const SideBar: FC<SideBarProps> = ({ sidebarData, showUserInfo = true }) => {
  const { t } = useTranslation(["dashBoard", "common"]);
  const { user } = useAuthContext();

  const pathname = usePathname();

  const pathnameWithoutLang = "/" + pathname.split("/").slice(2).join("/");

  const renderUserInfo = () => {
    return (
      <div className="hidden w-full flex-col items-center space-y-6 border-neutral-200 px-0 text-center dark:border-neutral-700 sm:space-y-7 sm:rounded-2xl sm:border sm:p-6 lg:flex xl:p-8">
        <Avatar
          hasCheckedClass="w-6 h-6 -top-0.5 right-2"
          sizeClass="w-24 h-24"
          imgUrl={user?.avatar}
          userName={user?.name}
        />

        {/* ---- */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <h2 className="line-clamp-2 text-2xl font-semibold">
            {user?.name ?? "VietSearch"}
          </h2>
        </div>

        {/* ---- */}
        {user?.email && (
          <p className="w-full overflow-hidden text-ellipsis text-neutral-500 dark:text-neutral-400">
            {user.email}
          </p>
        )}
      </div>
    );
  };

  const renderSideBarMobile = () => {
    return (
      <Disclosure
        as="div"
        className="mb-5 text-neutral-900 dark:text-white lg:hidden"
      >
        <Disclosure.Button className="flex w-full rounded-lg border bg-neutral-100 px-4 text-sm font-medium uppercase tracking-wide shadow-md hover:bg-neutral-200 dark:hover:bg-neutral-800">
          <span className={`block w-max py-2.5 pr-3`}>{t("common:menu")}</span>
          <span className="flex flex-1" onClick={(e) => e.preventDefault()}>
            <Disclosure.Button
              as="span"
              className="flex flex-1 items-center justify-end py-2.5 "
            >
              <ChevronDownIcon
                className="ml-2 h-4 w-4 text-neutral-500"
                aria-hidden="true"
              />
            </Disclosure.Button>
          </span>
        </Disclosure.Button>
        <Disclosure.Panel className="mt-2">
          {sidebarData.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={`flex flex-row items-center gap-3 rounded-md px-4 py-2 font-medium capitalize transition-all dark:text-neutral-200 hover:dark:bg-neutral-800 ${pathnameWithoutLang === item.url ? "text bg-primary-50 text-primary-500 dark:bg-neutral-700" : "hover:bg-neutral-50"}`}
            >
              {item?.icon && item.icon}
              {item.name}
            </Link>
          ))}
        </Disclosure.Panel>
      </Disclosure>
    );
  };

  return (
    <div className="mb-8 block w-full min-w-[25%] grow lg:mb-0 lg:w-1/4">
      <div className="lg:sticky lg:top-24">
        {renderSideBarMobile()}
        {showUserInfo && renderUserInfo()}
        {/* <div className="hidden sm:flex w-full flex-col items-center space-y-6 border-neutral-200 px-0 text-center dark:border-neutral-700 sm:space-y-7 sm:rounded-2xl sm:border sm:p-6 xl:p-8"> */}
        <div
          className={`hidden w-full space-y-2 p-4 lg:block ${!showUserInfo ? "rounded-2xl border border-neutral-200 dark:border-neutral-700" : ""}`}
        >
          {sidebarData.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={`flex flex-row items-center gap-3 rounded-md px-4 py-2 font-medium capitalize transition-all dark:text-neutral-200 hover:dark:bg-neutral-800 ${pathnameWithoutLang === item.url ? "text bg-primary-50 text-primary-500 dark:bg-neutral-700" : "hover:bg-neutral-50"}`}
            >
              {item?.icon && item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
