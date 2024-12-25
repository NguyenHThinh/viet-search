"use client";

import { Popover, Tab, Transition } from "@headlessui/react";
import {
  BanknotesIcon,
  ChevronDownIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import type { FC } from "react";
import { Fragment } from "react";

import { headerCurrency } from "./CurrencyDropdown";
import Link from "next/link";
import { useTranslation } from "@/app/i18n/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { allLangs, fallbackLng } from "@/app/i18n/config-lang";
import AppImage from "@/components/AppImage";

interface LangDropdownProps {
  panelClassName?: string;
  className?: string;
  lng: string;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const LangDropdown: FC<LangDropdownProps> = ({
  panelClassName = "top-full right-0 max-w-sm w-96",
  className = "hidden md:flex",
  lng,
}) => {
  const { t, i18n } = useTranslation(["common"]);
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = i18n.language;

  const changeLng = (newLng: string) => {
    if (!newLng) return;

    let newPathname = currentPathname.replace(
      `/${currentLocale}`,
      `/${newLng}`,
    );

    const newUrl = `${newPathname}?${searchParams.toString()}`;

    i18n.changeLanguage(newLng);

    router.push(newUrl.toString());

    router.refresh();
  };

  const renderLang = (close: () => void) => {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        {allLangs.map((item, index) => (
          <a
            key={index}
            onClick={() => {
              changeLng(item?.value ?? fallbackLng);
              close();
            }}
            className={`-m-3 flex cursor-pointer items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 dark:hover:bg-gray-700 ${lng === item?.value ? "bg-gray-100 dark:bg-gray-700" : "opacity-80"}`}
          >
            <div className="flex items-center gap-3">
              <AppImage
                src={item.icon}
                alt={item.value}
                width={30}
                height={20}
              />
              <p className="text-sm font-medium ">
                {t(item.value as "vi" | "en")}
              </p>
            </div>
          </a>
        ))}
      </div>
    );
  };

  const renderCurr = (close: () => void) => {
    return (
      <div className="grid gap-7 lg:grid-cols-2">
        {headerCurrency.map((item, index) => (
          <Link
            key={index}
            // href={item.href}
            href={"/"}
            onClick={() => close()}
            className={`-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 dark:hover:bg-gray-700 ${item.active ? "bg-gray-100 dark:bg-gray-700" : "opacity-80"}`}
          >
            <item.icon className="h-[18px] w-[18px] " />
            <p className="ml-2 text-sm font-medium ">{item.name}</p>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <Popover className={`LangDropdown relative ${className}`}>
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
                ${open ? "" : "text-opacity-80"}
             group inline-flex h-10 items-center self-center px-3 py-1.5 text-sm font-medium text-gray-800 hover:text-opacity-100 focus:outline-none dark:text-neutral-200 sm:h-12 `}
          >
            <GlobeAltIcon className="h-5 w-5 opacity-80" />
            <span className="mx-1">/</span>
            <BanknotesIcon className="h-5 w-5 opacity-80" />
            <ChevronDownIcon
              className={`${open ? "-rotate-180" : "text-opacity-70"}
                  ml-1 h-4 w-4  transition duration-150 ease-in-out group-hover:text-opacity-80`}
              aria-hidden="true"
            />
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
            <Popover.Panel className={`absolute z-20  ${panelClassName}`}>
              <div className="rounded-2xl bg-white p-3 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-800 sm:p-6">
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-full bg-gray-100 p-1 dark:bg-slate-700">
                    <Tab
                      key={"language"}
                      className={({ selected }) =>
                        classNames(
                          "w-full rounded-full py-2 text-sm font-medium leading-5 text-gray-700",
                          "focus:outline-none focus:ring-0",
                          selected
                            ? "bg-white shadow"
                            : "text-gray-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/40",
                        )
                      }
                    >
                      {t("common:language")}
                    </Tab>
                    <Tab
                      key={"currency"}
                      className={({ selected }) =>
                        classNames(
                          "w-full rounded-full py-2 text-sm font-medium leading-5 text-gray-700",
                          "focus:outline-none focus:ring-0",
                          selected
                            ? "bg-white shadow"
                            : "text-gray-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/40",
                        )
                      }
                    >
                      {t("common:currency")}
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className="mt-5">
                    <Tab.Panel
                      className={classNames(
                        "rounded-xl p-3",
                        "focus:outline-none focus:ring-0",
                      )}
                    >
                      {renderLang(close)}
                    </Tab.Panel>
                    <Tab.Panel
                      className={classNames(
                        "rounded-xl p-3",
                        "focus:outline-none focus:ring-0",
                      )}
                    >
                      {renderCurr(close)}
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
export default LangDropdown;
