"use client";

import { Popover, Transition } from "@headlessui/react";
import { Cog8ToothIcon as CogIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";

import type { PathName } from "@/routers/types";
import { useThemeMode } from "@/utils/useThemeMode";

import Header from "./Header";
import Header3 from "./Header3";

export type SiteHeaders = "Header 1" | "Header 2" | "Header 3" | "Header";

interface HomePageItem {
  name: string;
  slug: PathName;
}

const OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 1.0,
};
let OBSERVER: IntersectionObserver | null = null;
const PAGES_HIDE_HEADER_BORDER: PathName[] = [
  "/home-3",
  "/listing-car-detail",
  "/listing-experiences-detail",
  "/listing-stay-detail",
];

const SiteHeader = ({ lng }: { lng: string }) => {
  const anchorRef = useRef<HTMLDivElement>(null);

  const [headers] = useState<SiteHeaders[]>([
    "Header 1",
    "Header 2",
    "Header 3",
    "Header",
  ]);

  const [homePages] = useState<HomePageItem[]>([
    { name: "Travel", slug: "/" },
    { name: "Real Estate", slug: "/home-2" },
    { name: "Booking", slug: "/home-3" },
  ]);
  const [headerSelected, setHeaderSelected] = useState<SiteHeaders>("Header");

  const [isTopOfPage, setIsTopOfPage] = useState(true);

  useEffect(() => {
    setIsTopOfPage(window.pageYOffset < 5);
  }, []);
  //
  useThemeMode();
  //
  const pathname = usePathname();

  const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      setIsTopOfPage(entry.isIntersecting);
    });
  };

  useEffect(() => {
    // disconnect the observer
    // observer for show the LINE bellow header
    if (!PAGES_HIDE_HEADER_BORDER.includes(pathname as PathName)) {
      OBSERVER && OBSERVER.disconnect();
      OBSERVER = null;
      return;
    }
    if (!OBSERVER) {
      OBSERVER = new IntersectionObserver(intersectionCallback, OPTIONS);
      anchorRef.current && OBSERVER.observe(anchorRef.current);
    }
  }, [pathname]);

  const renderRadioHeaders = () => {
    return (
      <div className="mt-4">
        <span className="text-sm font-medium">Header Styles</span>
        <div className="mt-1.5 flex items-center space-x-2">
          {headers.map((header) => {
            return (
              <div
                key={header}
                className={`flex cursor-pointer select-none items-center rounded-full px-3.5 py-1.5 text-xs font-medium 
                ${
                  headerSelected === header
                    ? "bg-black text-white shadow-lg shadow-black/10"
                    : "border border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
                }`}
                onClick={() => setHeaderSelected(header)}
              >
                {header}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRadioHomePages = () => {
    return (
      <div className="mt-4">
        <span className="text-sm font-medium">Home Demos</span>
        <div className="mt-1.5 flex items-center space-x-2">
          {homePages.map((home) => {
            return (
              <Link
                key={home.slug}
                href={home.slug}
                className={`flex cursor-pointer select-none items-center rounded-full px-3.5 py-1.5 text-xs font-medium ${
                  pathname === home.slug
                    ? "bg-black text-white shadow-lg shadow-black/10"
                    : "border border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
                }`}
              >
                {home.name}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  // FOR DEMO PAGE
  const renderControlSelections = () => {
    return (
      <div className="ControlSelections relative z-40 hidden lg:block">
        <div className="fixed right-3 top-1/4 z-40 flex items-center">
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={`z-10 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-xl hover:bg-neutral-100 focus:outline-none dark:border-primary-6000 dark:bg-primary-6000 dark:hover:bg-primary-700 ${
                    open ? " ring-primary-500 focus:ring-2" : ""
                  }`}
                >
                  <CogIcon className="h-8 w-8" />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-3 w-screen max-w-sm">
                    <div className="nc-custom-shadow-1 overflow-hidden rounded-2xl bg-white dark:bg-neutral-800">
                      <div className="relative p-6">
                        <span className="text-xl font-semibold">Customize</span>
                        <div className="mt-4 w-full border-b border-neutral-200 dark:border-neutral-700" />
                        {renderRadioHeaders()}
                        {renderRadioHomePages()}
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    let headerClassName = "shadow-sm dark:border-b dark:border-neutral-700";
    if (PAGES_HIDE_HEADER_BORDER.includes(pathname as PathName)) {
      headerClassName = isTopOfPage
        ? ""
        : "shadow-sm dark:border-b dark:border-neutral-700";
    }
    switch (headerSelected) {
      case "Header":
        return (
          <Header className={headerClassName} navType="MainNav" lng={lng} />
        );
      case "Header 1":
        return (
          <Header className={headerClassName} navType="MainNav1" lng={lng} />
        );
      case "Header 2":
        return (
          <Header className={headerClassName} navType="MainNav2" lng={lng} />
        );
      case "Header 3":
        return <Header3 className={headerClassName} lng={lng} />;
      default:
        return (
          <Header className={headerClassName} navType="MainNav1" lng={lng} />
        );
    }
  };

  return (
    <>
      {/*{renderControlSelections()}*/}
      {renderHeader()}
      <div ref={anchorRef} className="invisible absolute h-1" />
    </>
  );
};

export default SiteHeader;
