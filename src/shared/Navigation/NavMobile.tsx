"use client";

import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";

import LangDropdown from "@/app/[lng]/(client-components)/(Header)/LangDropdown";
import { NAVIGATION_DEMO } from "@/data/navigation";
import ButtonClose from "@/shared/ButtonClose";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Logo from "@/shared/Logo";
import SocialsList from "@/shared/SocialsList";
import SwitchDarkMode from "@/shared/SwitchDarkMode";

import type { NavItemType } from "./NavigationItem";
import { useAuthContext } from "@/auth/useAuthContext";
import { SocialType } from "@/shared/SocialsShare";
import { PATH_AUTH, PATH_PAGE, PATH_USER_DASHBOARD } from "@/contains/paths";
import ncNanoId from "@/utils/ncNanoId";
import { useTranslation } from "@/app/i18n/client";

export interface NavMobileProps {
  data?: NavItemType[];
  onClickClose?: () => void;
  lng: string;
}

const socials: SocialType[] = [
  {
    name: "Facebook",
    icon: "lab la-facebook-f",
    href: "https://www.facebook.com/vietsearch.org",
  },
  {
    name: "Linkedin",
    icon: "lab la-linkedin-in",
    href: "https://www.linkedin.com/company/35719567/admin/dashboard/",
  },
  {
    name: "Youtube",
    icon: "lab la-youtube",
    href: "https://www.youtube.com/@vietsearchorg9486",
  },
  // { name: "Twitter", icon: "lab la-twitter", href: "#" },
  // { name: "Instagram", icon: "lab la-instagram", href: "#" },
];
const NAVIGATION: NavItemType[] = [
  {
    id: ncNanoId(),
    href: PATH_PAGE.root,
    name: "Home",
    isNew: true,
  },
  {
    id: ncNanoId(),
    href: PATH_USER_DASHBOARD.account,
    name: "My Account",
    isNew: true,
  },
  {
    id: ncNanoId(),
    href: PATH_USER_DASHBOARD.accountWishlist,
    name: "Wishlist",
    isNew: true,
  },
  {
    id: ncNanoId(),
    href: PATH_USER_DASHBOARD.accountBusiness,
    name: "VietSearch For Business",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: PATH_PAGE.addBusiness,
        name: "Add your business",
      },
    ],
  },
];

const NavMobile: React.FC<NavMobileProps> = ({
  data = NAVIGATION,
  onClickClose,
  lng,
}) => {
  const { t } = useTranslation(["common", "dashBoard"]);
  const { isAuthenticated, logout } = useAuthContext();

  const SUPPORT_NAVIGATION: NavItemType[] = [
    {
      id: ncNanoId(),
      href: PATH_PAGE.contact,
      name: t("common:contacts"),
      isNew: true,
    },
    {
      id: ncNanoId(),
      href: PATH_PAGE.privacy,
      name: t("common:privacy"),
      isNew: true,
    },
    {
      id: ncNanoId(),
      href: PATH_PAGE.term,
      name: t("common:term"),
      isNew: true,
    },
  ];

  const BUSINESS_NAVIGATION: NavItemType[] = [
    {
      id: ncNanoId(),
      href: PATH_PAGE.business.root,
      name: t("dashBoard:aboutVSBusiness"),
    },
    {
      id: ncNanoId(),
      href: PATH_PAGE.addBusiness,
      name: t("common:addYourBusiness"),
    },
    {
      id: ncNanoId(),
      href: PATH_PAGE.addBusiness,
      name: t("common:claimYourBusiness"),
    },
  ];

  const BUSINESS_NAVIGATION_CHILDMENU: NavItemType = {
    id: ncNanoId(),
    name: t("common:vietSearchForBusiness"),
    href: PATH_PAGE.business.root,
    children: BUSINESS_NAVIGATION,
    type: "dropdown",
    isNew: true,
  };

  const _renderMenuChild = (item: NavItemType) => {
    return (
      <ul className="nav-mobile-sub-menu pb-1 pl-6 text-base">
        {item.children?.map((i, index) => (
          <Disclosure key={i.href + index} as="li">
            <Link
              href={{
                pathname: i.href || undefined,
              }}
              className="mt-0.5 flex rounded-lg px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <span
                className={`py-2.5 pr-3 ${!i.children ? "block w-full" : ""}`}
              >
                {i.name}
              </span>
              {i.children && (
                <span
                  className="flex flex-1"
                  onClick={(e) => e.preventDefault()}
                >
                  <Disclosure.Button
                    as="span"
                    className="flex flex-1 justify-end py-2.5"
                  >
                    <ChevronDownIcon
                      className="ml-2 h-4 w-4 text-neutral-500"
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                </span>
              )}
            </Link>
            {i.children && (
              <Disclosure.Panel>{_renderMenuChild(i)}</Disclosure.Panel>
            )}
          </Disclosure>
        ))}
      </ul>
    );
  };

  const _renderItem = (item: NavItemType) => {
    return (
      <Disclosure
        key={item.id}
        as="li"
        className="text-neutral-900 dark:text-white"
      >
        <Link
          className="flex w-full rounded-lg px-4 text-sm font-medium uppercase tracking-wide hover:bg-neutral-100 dark:hover:bg-neutral-800"
          href={{
            pathname: item.href || undefined,
          }}
        >
          <span
            className={`py-2.5 pr-3 ${!item.children ? "block w-full" : ""}`}
          >
            {item.name}
          </span>
          {item.children && (
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
          )}
        </Link>
        {item.children && (
          <Disclosure.Panel>{_renderMenuChild(item)}</Disclosure.Panel>
        )}
      </Disclosure>
    );
  };

  return (
    <div className="h-screen w-full divide-y-2 divide-neutral-100 overflow-y-auto bg-white py-2 shadow-lg ring-1 transition dark:divide-neutral-800 dark:bg-neutral-900 dark:ring-neutral-700">
      <div className="px-5 py-6">
        <Logo className="w-full" />
        <div className="mt-5 flex flex-col text-sm text-neutral-700 dark:text-neutral-300">
          {/*<span>*/}
          {/*  Discover the most outstanding articles on all topics of life. Write*/}
          {/*  your stories and share them*/}
          {/*</span>*/}

          <div className="mt-4 flex items-center justify-between">
            <SocialsList
              socials={socials}
              itemClass="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-800 dark:text-neutral-300"
            />
            <span className="block">
              <SwitchDarkMode className="bg-neutral-100 dark:bg-neutral-800" />
            </span>
          </div>
        </div>
        <span className="absolute right-2 top-2 p-1">
          <ButtonClose onClick={onClickClose} />
        </span>
      </div>
      <ul className="flex flex-col space-y-1 p-2 pt-6">
        {data.map(_renderItem)}
      </ul>
      <ul className="flex flex-col space-y-1 p-2">
        <li className="text-neutral-900 dark:text-white">
          <a
            className="flex w-full rounded-lg px-4 text-sm font-medium uppercase tracking-wide hover:bg-neutral-100 dark:hover:bg-neutral-800"
            href="https://expert.vietsearch.org/"
            target="_blank"
          >
            <span className="py-2.5 pr-3">
              {t("dashBoard:vietsearchExpert")}
            </span>
          </a>
        </li>
        {/* {BUSINESS_NAVIGATION.map(_renderItem)} */}
        {_renderItem(BUSINESS_NAVIGATION_CHILDMENU)}
      </ul>
      <ul className="flex flex-col space-y-1 p-2 pb-6">
        {SUPPORT_NAVIGATION.map(_renderItem)}
      </ul>
      <div className="flex items-center justify-between px-5 py-6">
        {isAuthenticated ? (
          <ButtonPrimary
            onClick={() => {
              logout();
              if (onClickClose) {
                onClickClose();
              }
            }}
          >
            {t("common:auth.logout")}
          </ButtonPrimary>
        ) : (
          <Link href={PATH_AUTH.login}>
            <ButtonPrimary>{t("common:auth.login")}</ButtonPrimary>
          </Link>
        )}

        <LangDropdown
          lng={lng}
          className="flex"
          panelClassName="z-10 w-screen max-w-[280px] px-4 mb-3 right-3 bottom-full sm:px-0"
        />
      </div>
    </div>
  );
};

export default NavMobile;
