"use client";

import React from "react";

import type { CustomLink } from "@/data/types";
import Logo from "@/shared/Logo";
import SocialsList1 from "@/shared/SocialsList1";

import FooterNav from "./FooterNav";
import btnAndroidPng from "@/images/btn-android.png";
import btnIosPng from "@/images/btn-ios.png";
import { useTranslation } from "@/app/i18n/client";
import {
  PATH_BUSINESS_DASHBOARD,
  PATH_PAGE,
  PATH_USER_DASHBOARD,
} from "@/contains/paths";
import NextImage from "./NextImage";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const Footer: React.FC = () => {
  const { t } = useTranslation(["common", "footer"]);

  const widgetMenus: WidgetFooterMenu[] = [
    {
      id: "5",
      title: t("footer:feature"),
      menus: [
        { href: PATH_PAGE.searchBusiness, label: t("footer:searchBusiness") },
        {
          href: PATH_USER_DASHBOARD.accountWishlist,
          label: t("common:wishlist"),
        },
        { href: PATH_USER_DASHBOARD.account, label: t("common:myAccount") },
        // { href: "#", label: "Add comments" },
      ],
    },
    {
      id: "1",
      title: t("common:vietSearchForBusiness"),
      menus: [
        { href: PATH_PAGE.addBusiness, label: t("common:addYourBusiness") },
        { href: PATH_PAGE.addBusiness, label: t("common:claimYourBusiness") },
        {
          href: PATH_BUSINESS_DASHBOARD.createdBusiness,
          label: t("footer:businessDashboard"),
        },
        // { href: "#", label: "Design systems" },
        // { href: "#", label: "Pricing" },
        // { href: "#", label: "Security" },
      ],
    },
    {
      id: "2",
      title: t("common:support"),
      menus: [
        { href: PATH_PAGE.contact, label: t("common:contacts") },
        { href: PATH_PAGE.privacy, label: t("common:privacy") },
        { href: PATH_PAGE.term, label: t("common:term") },
        // { href: "#", label: "For Developers" },
        // { href: "#", label: "Releases" },
      ],
    },
    // {
    //   id: "4",
    //   title: t("footer:information"),
    //   menus: [
    //     { href: "#", label: t("footer:aboutUs") },
    //     { href: "#", label: t("footer:teamVS") },
    //     { href: "#", label: t("footer:sponsor") },
    //     { href: "#", label: t("footer:recruitment") },
    //   ],
    // },
  ];

  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
          {menu.title}
        </h2>
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <a
                key={index}
                className="text-neutral-6000 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                href={item.href}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <FooterNav />

      <div className="nc-Footer relative border-t border-neutral-200 py-24 dark:border-neutral-700 lg:py-28">
        <div className="container grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 ">
          <div className="col-span-2 grid grid-cols-4 gap-5 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
            <div className="col-span-2 md:col-span-1">
              <Logo />
            </div>
            <div className="col-span-2 flex items-center md:col-span-3">
              <SocialsList1 className="flex items-center space-x-3 lg:flex-col lg:items-start lg:space-x-0 lg:space-y-2.5" />
            </div>
          </div>
          {widgetMenus.map(renderWidgetMenuItem)}
          <div className="flex flex-col gap-3">
            <a
              href="https://apps.apple.com/us/app/vietsearch/id1482035858"
              target="_blank"
              rel="noopener noreferrer"
            >
              <NextImage src={btnIosPng} alt="" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=org.vietsearch.android"
              target="_blank"
              rel="noopener noreferrer"
            >
              <NextImage src={btnAndroidPng} alt="" />
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          © 2020-{new Date().getFullYear()}{" "}
          <a href="https://riksoft.vn" className="hover:underline">
            RikSoft
          </a>{" "}
          - VietSearch . All Rights Reserved.
        </span>
      </div>
    </>
  );
};

export default Footer;
