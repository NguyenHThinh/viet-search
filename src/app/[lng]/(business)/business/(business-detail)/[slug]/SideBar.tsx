"use client";

import { useTranslation } from "@/app/i18n/client";
import { PATH_CLAIM } from "@/contains/paths";
import { STATUS_BUSINESS } from "@/constants/business";
import { IBusiness } from "@/models/iBusiness";
import { linkify } from "@/utils/general";
import {
  EnvelopeIcon,
  GlobeAltIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import _ from "lodash";
import { FC, useState } from "react";
import SuggestionEdit from "./SuggestionEdit";
import Link from "next/link";

interface SideBarProps {
  detailData: IBusiness | null;
}

const SideBar: FC<SideBarProps> = ({ detailData }) => {
  const { t } = useTranslation(["detail"]);
  const [isShowClaimBusiness, setIsShowClaimBusiness] = useState(
    detailData?.status !== STATUS_BUSINESS.verified || !detailData?.user_id,
  );

  const renderContactInfo = (info: { type: string; value: string }) => {
    const linkStyle =
      "inline-flex w-full items-center justify-between font-medium mb-2";
    switch (info?.type) {
      case "email":
        return (
          <div className={`${linkStyle}`}>
            <a
              href={`mailto:${info.value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-blue-600 hover:underline"
            >
              {info?.value}
            </a>
            <EnvelopeIcon className="h-6 w-6 min-w-max" />
          </div>
        );
      case "homepage":
        return (
          <div className={`${linkStyle}`}>
            <a
              href={linkify(info.value)}
              target="_blank"
              className="line-clamp-2 text-blue-600 hover:underline"
            >
              {info?.value}
            </a>
            <HomeIcon className="h-6 w-6 min-w-max" />
          </div>
        );
      case "facebook":
        return (
          <div className={`${linkStyle}`}>
            <a
              href={linkify(info.value)}
              target="_blank"
              className="truncate text-blue-600 hover:underline"
            >
              {_.startCase(info?.type)}
            </a>
            <i
              className="lab la-facebook-square"
              style={{ fontSize: "24px" }}
            ></i>
          </div>
        );
      case "linkedin":
        return (
          <div className={`${linkStyle}`}>
            <a
              href={linkify(info.value)}
              target="_blank"
              className="truncate text-blue-600 hover:underline"
            >
              {_.startCase(info?.type)}
            </a>
            <i className="lab la-linkedin" style={{ fontSize: "24px" }}></i>
          </div>
        );
      case "xcom":
        return (
          <div className={`${linkStyle}`}>
            <a
              href={linkify(info.value)}
              target="_blank"
              className="truncate text-blue-600 hover:underline"
            >
              {_.startCase(info?.type)}
            </a>
            <i className="lab la-twitter" style={{ fontSize: "24px" }}></i>
          </div>
        );
      case "phone":
        return (
          <div className={`${linkStyle}`}>
            <a
              href={`tel:${info.value}`}
              className={`truncate text-blue-600 hover:underline`}
            >
              {info?.value}
            </a>
            <PhoneIcon className="h-6 w-6 min-w-max" />
          </div>
        );
      case "fax":
        return (
          <div className={`${linkStyle}`}>
            <a
              href={`tel:${info.value}`}
              className={`truncate text-blue-600 hover:underline`}
            >
              {info?.value}
            </a>
            <PhoneIcon className="h-6 w-6 min-w-max" />
          </div>
        );
      case "mobile":
        return (
          <div className={`${linkStyle}`}>
            <a
              href={`tel:${info.value}`}
              className={`truncate text-blue-600 hover:underline`}
            >
              {info?.value}
            </a>
            <PhoneIcon className="h-6 w-6 min-w-max" />
          </div>
        );
      case "website":
        return (
          <div className={`${linkStyle}`}>
            <a
              href={linkify(info.value)}
              target="_blank"
              className="truncate text-blue-600 hover:underline"
            >
              {info.value}
            </a>
            <GlobeAltIcon className="h-6 w-6 min-w-max" />
          </div>
        );
    }
  };

  const renderSidebar = () => {
    return (
      <div className="listingSectionSidebar__wrap mb-6 shadow-xl">
        {/* CONTACT */}
        <div className="flex flex-col space-y-3">
          {!!detailData?.contacts?.length &&
            detailData.contacts.map(
              (info, index) =>
                info?.value && (
                  <div key={index}>
                    {renderContactInfo(info)}
                    <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
                  </div>
                ),
            )}
          {detailData?.address?.displayed && (
            <div className="flex w-full cursor-default items-center justify-between font-medium">
              <p className="line-clamp-2">{detailData?.address?.displayed}</p>
              <MapPinIcon className="h-6 w-6 min-w-max" />
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <SuggestionEdit detailData={detailData} />
      </div>
    );
  };

  const renderClaimBusiness = () => {
    return (
      <div className="listingSectionSidebar__wrap relative">
        {/* header */}
        <div className="flex flex-row items-start justify-between gap-4">
          <BuildingStorefrontIcon className="h-12 w-12 text-[#A4ACB6]" />
          <button className="" onClick={() => setIsShowClaimBusiness(false)}>
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* content */}
        <div className="max-w-[85%]">
          <p className="mb-2 text-lg font-semibold">{t("detail:claimTitle")}</p>
          <span className="text-sm font-medium text-neutral-400">
            {t("detail:claimDesc")}
          </span>
        </div>

        {/* SUBMIT */}
        <Link
          href={PATH_CLAIM.claimVerify(detailData?.id || "")}
          className="w-max rounded-md border px-4 py-2 font-medium shadow-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          {t("detail:claimButton")}
        </Link>
      </div>
    );
  };

  return (
    <div className="mt-14 hidden grow lg:mt-0 lg:block lg:w-2/5 xl:w-1/3">
      <div className="sticky top-28">
        {/* contact tab */}
        {renderSidebar()}
        {/* claim business tab */}
        {isShowClaimBusiness && renderClaimBusiness()}
      </div>
    </div>
  );
};

export default SideBar;
