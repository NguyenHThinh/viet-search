"use client";

import { useTranslation } from "@/app/i18n/client";
import { PATH_BUSINESS_DASHBOARD } from "@/contains/paths";
import { BusinessDetailProvider } from "@/contexts/businessDetailContext";
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  ClockIcon,
  PhotoIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { ReactElement, useCallback } from "react";
import UserInfomation from "../components/UserInfomation";
import Button from "@/shared/Button";

const EditBusinessLayout = ({ children }: { children: ReactElement }) => {
  const { t, i18n } = useTranslation(["dashBoard", "addBusiness"]);
  const { slug } = useParams();
  const pathname = usePathname();
  //
  const pathnameWithoutLang = "/" + pathname.split("/").slice(2).join("/");

  const renderSideBar = () => {
    return (
      <div className="w-full space-y-2 p-4">
        <Link
          href={PATH_BUSINESS_DASHBOARD.editBusiness(String(slug))}
          className={`flex flex-row items-center gap-3 rounded-md px-4 py-2 transition-all dark:text-neutral-200 hover:dark:bg-neutral-800 ${pathnameWithoutLang === PATH_BUSINESS_DASHBOARD.editBusiness(String(slug)) ? "text bg-primary-50 text-primary-500 dark:bg-neutral-700" : "hover:bg-neutral-50"}`}
        >
          <BuildingOffice2Icon className="h-6 w-6" />
          <p>{t("addBusiness:businessInfo")}</p>
        </Link>
        {/* ---- */}
        <Link
          href={PATH_BUSINESS_DASHBOARD.openHoursBusiness(String(slug))}
          className={`flex flex-row items-center gap-3 rounded-md px-4 py-2 transition-all dark:text-neutral-200 hover:dark:bg-neutral-800 ${pathnameWithoutLang === PATH_BUSINESS_DASHBOARD.openHoursBusiness(String(slug)) ? "text bg-primary-50 text-primary-500 dark:bg-neutral-700" : "hover:bg-neutral-50"}`}
        >
          <ClockIcon className="h-6 w-6" />
          <p>{t("addBusiness:stepTitle.openTime")}</p>
        </Link>
        {/* ---- */}
        <Link
          href={PATH_BUSINESS_DASHBOARD.logoBusiness(String(slug))}
          className={`flex flex-row items-center gap-3 rounded-md px-4 py-2 transition-all dark:text-neutral-200 hover:dark:bg-neutral-800 ${pathnameWithoutLang === PATH_BUSINESS_DASHBOARD.logoBusiness(String(slug)) ? "text bg-primary-50 text-primary-500 dark:bg-neutral-700" : "hover:bg-neutral-50"}`}
        >
          <PhotoIcon className="h-6 w-6" />
          <p>{t("addBusiness:logo")}</p>
        </Link>
        {/* ---- */}
        <Link
          href={PATH_BUSINESS_DASHBOARD.photosBusiness(String(slug))}
          className={`flex flex-row items-center gap-3 rounded-md px-4 py-2 transition-all dark:text-neutral-200 hover:dark:bg-neutral-800 ${pathnameWithoutLang === PATH_BUSINESS_DASHBOARD.photosBusiness(String(slug)) ? "text bg-primary-50 text-primary-500 dark:bg-neutral-700" : "hover:bg-neutral-50"}`}
        >
          <PhotoIcon className="h-6 w-6" />
          <p>{t("addBusiness:photos")}</p>
        </Link>
        {/* ---- */}
        <Link
          href={PATH_BUSINESS_DASHBOARD.reviewedBusiness(String(slug))}
          className={`flex flex-row items-center gap-3 rounded-md px-4 py-2 transition-all dark:text-neutral-200 hover:dark:bg-neutral-800 ${pathnameWithoutLang === PATH_BUSINESS_DASHBOARD.reviewedBusiness(String(slug)) ? "text bg-primary-50 text-primary-500 dark:bg-neutral-700" : "hover:bg-neutral-50"}`}
        >
          <StarIcon className="h-6 w-6" />
          <p>{t("dashBoard:reviews")}</p>
        </Link>
        {/* ---- */}
      </div>
    );
  };

  return (
    <BusinessDetailProvider slug={String(slug)}>
      <div className={`nc-EditBusinessLayout container`}>
        <Button
          href={PATH_BUSINESS_DASHBOARD.createdBusiness}
          className="mb-2 mt-6 flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-5" href="" />
          {t("addBusiness:goBack")}
        </Button>
        <main className=" mb-24 grid grid-cols-12 lg:mb-32 lg:space-x-5">
          <div className="col-span-12 mb-24 block w-full lg:col-span-3 lg:mb-0">
            <div className="lg:sticky lg:top-24">
              <UserInfomation />
              {renderSideBar()}
            </div>
          </div>
          <div className="listingSection__wrap col-span-12 space-y-6 border-neutral-200 px-0 dark:border-neutral-700 sm:space-y-7 sm:rounded-2xl sm:border lg:col-span-9">
            {children}
          </div>
        </main>
      </div>
    </BusinessDetailProvider>
  );
};

export default EditBusinessLayout;
