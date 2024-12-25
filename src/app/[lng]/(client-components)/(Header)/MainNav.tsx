import Link from "next/link";
import type { FC } from "react";
import React from "react";

import type { Route } from "@/routers/types";
import Logo from "@/shared/Logo";
import MenuBar from "@/shared/MenuBar";
import SwitchDarkMode from "@/shared/SwitchDarkMode";

import HeroSearchForm2MobileFactory from "../(HeroSearchForm2Mobile)/HeroSearchForm2MobileFactory";
import AvatarDropdown from "./AvatarDropdown";
import DropdownTravelers from "./DropdownTravelers";
import LangDropdown from "./LangDropdown";
import { useAuthContext } from "@/auth/useAuthContext";
import { PATH_AUTH, PATH_PAGE } from "@/contains/paths";
import MenuBarDropdown from "@/app/[lng]/(client-components)/(Header)/MenuBarDropdown";
import { useTranslation } from "@/app/i18n/client";
import VietSearchForBusinessDropdown from "@/app/[lng]/(client-components)/(Header)/VietSearchForBusinessDropdown";
// import TemplatesDropdown from "./TemplatesDropdown";

export interface MainNavProps {
  className?: string;
  lng: string;
}

const MainNav: FC<MainNavProps> = ({ className = "", lng }) => {
  const { t } = useTranslation(["common", "dashBoard"]);
  const { isAuthenticated } = useAuthContext();
  return (
    <div className={`MainNav relative z-10 ${className}`}>
      <div className="flex h-20 justify-between px-4 lg:container">
        <div className="hidden flex-1 items-center justify-start space-x-3 sm:space-x-8 md:flex lg:space-x-10">
          <Logo className="w-38 self-center" />
          <div className="hidden h-10 self-center border-l border-neutral-300 dark:border-neutral-500 lg:block" />
          {/*<div className="hidden lg:flex ">*/}
          <VietSearchForBusinessDropdown />
          {/*</div>*/}
          <div className="inline-flex flex-row items-center">
            <a
              href="https://expert.vietsearch.org/"
              className="py-2 text-sm font-medium capitalize hover:text-opacity-100 focus:outline-none sm:text-base"
              target="_blank"
            >
              {t("dashBoard:vietsearchExpert")}
            </a>
          </div>
        </div>

        <div className="!mx-auto max-w-lg flex-[3] self-center md:px-3 lg:hidden">
          <HeroSearchForm2MobileFactory />
        </div>

        <div className="hidden flex-1 shrink-0 justify-end text-neutral-700 dark:text-neutral-100 md:flex lg:flex-none">
          <div className="hidden space-x-1 lg:flex">
            {/*<TemplatesDropdown />*/}
            {/*<Link*/}
            {/*  href={PATH_PAGE.addBusiness}*/}
            {/*  className="group inline-flex items-center self-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-gray-700 text-opacity-90 hover:border-neutral-400 hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:border-neutral-700 dark:text-neutral-300"*/}
            {/*>*/}
            {/*  {t("common:vietSearchForBusiness")}*/}
            {/*</Link>*/}
            <LangDropdown lng={lng} />

            <SwitchDarkMode />
            {/* <NotifyDropdown /> */}
            {isAuthenticated ? (
              <AvatarDropdown />
            ) : (
              <Link
                href={PATH_AUTH.login}
                className="ttnc-ButtonPrimary group inline-flex items-center self-center rounded-full border border-neutral-300 bg-primary-6000 px-4 py-2 text-sm font-medium  text-neutral-50 text-opacity-90 hover:border-neutral-400 hover:bg-primary-700 hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 disabled:bg-opacity-70 dark:border-neutral-700 dark:text-neutral-300"
              >
                {t("common:auth.login")}
              </Link>
            )}
            <AvatarDropdown isMenuBar={true} />
          </div>
          <div className="flex space-x-2 lg:hidden">
            {/*<NotifyDropdown />*/}
            <SwitchDarkMode />
            {isAuthenticated && <AvatarDropdown />}
            <MenuBar lng={lng} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
