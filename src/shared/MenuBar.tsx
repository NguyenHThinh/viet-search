import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";

import NavMobile from "./Navigation/NavMobile";
import { NavItemType } from "@/shared/Navigation/NavigationItem";
import ncNanoId from "@/utils/ncNanoId";
import {
  PATH_BUSINESS_DASHBOARD,
  PATH_PAGE,
  PATH_USER_DASHBOARD,
} from "@/contains/paths";
import { useTranslation } from "@/app/i18n/client";

export interface MenuBarProps {
  lng: string;
  className?: string;
  iconClassName?: string;
}

const MenuBar: React.FC<MenuBarProps> = ({
  className = "p-2.5 rounded-lg text-neutral-700 dark:text-neutral-300",
  iconClassName = "h-8 w-8",
  lng,
}) => {
  const { t } = useTranslation(["common", "dashBoard", "footer"]);
  const pathname = usePathname();

  const pathnameWithoutLang = "/" + pathname.split("/").slice(2).join("/");

  // check and config menu mobile in Account page path
  const accountPath = [
    PATH_USER_DASHBOARD.account,
    PATH_USER_DASHBOARD.accountWishlist,
    PATH_USER_DASHBOARD.accountPassword,
    PATH_USER_DASHBOARD.accountPhotos,
    PATH_USER_DASHBOARD.accountReviews,
  ];
  const NAVIGATION_ACCOUNT_PAGE: NavItemType[] = [
    {
      id: ncNanoId(),
      href: PATH_USER_DASHBOARD.account,
      name: t("dashBoard:account"),
    },
    {
      id: ncNanoId(),
      href: PATH_USER_DASHBOARD.accountPassword,
      name: t("dashBoard:password"),
    },
    {
      id: ncNanoId(),
      href: PATH_USER_DASHBOARD.accountPhotos,
      name: t("dashBoard:photos"),
    },
    {
      id: ncNanoId(),
      href: PATH_USER_DASHBOARD.accountReviews,
      name: t("dashBoard:reviews"),
    },
  ];

  const NAVIGATION: NavItemType[] = [
    {
      id: ncNanoId(),
      href: PATH_PAGE.root,
      name: t("common:home"),
      isNew: true,
    },
    ...(accountPath.includes(pathnameWithoutLang)
      ? NAVIGATION_ACCOUNT_PAGE
      : [
          {
            id: ncNanoId(),
            href: PATH_USER_DASHBOARD.account,
            name: t("common:myAccount"),
            isNew: true,
          },
        ]),
    {
      id: ncNanoId(),
      href: PATH_USER_DASHBOARD.accountWishlist,
      name: t("common:wishlist"),
      isNew: true,
    },
    {
      id: ncNanoId(),
      href: PATH_BUSINESS_DASHBOARD.createdBusiness,
      name: t("footer:businessDashboard"),
      isNew: true,
    },
  ];

  const [isVisable, setIsVisable] = useState(false);

  useEffect(() => {
    setIsVisable(false);
  }, [pathname]);

  const handleOpenMenu = () => setIsVisable(true);
  const handleCloseMenu = () => setIsVisable(false);

  const renderContent = () => {
    return (
      <Transition appear show={isVisable} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 overflow-hidden"
          onClose={handleCloseMenu}
        >
          <Transition.Child
            as={Fragment}
            enter=" duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave=" duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/60 dark:bg-black/70" />
          </Transition.Child>
          <div className="fixed inset-0">
            <div className="flex min-h-full justify-end ">
              <Transition.Child
                as={Fragment}
                enter="transition duration-100 transform"
                enterFrom="opacity-0 translate-x-56"
                enterTo="opacity-100 translate-x-0"
                leave="transition duration-150 transform"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-56"
              >
                <Dialog.Panel className="w-full max-w-md overflow-hidden transition-all">
                  <NavMobile
                    lng={lng}
                    onClickClose={handleCloseMenu}
                    data={NAVIGATION}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return (
    <>
      <button
        onClick={handleOpenMenu}
        className={`flex items-center justify-center focus:outline-none ${className}`}
      >
        <Bars3Icon className={iconClassName} />
      </button>

      {renderContent()}
    </>
  );
};

export default MenuBar;
