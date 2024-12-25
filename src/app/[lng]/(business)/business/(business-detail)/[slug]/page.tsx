import React from "react";
import StartRating from "@/components/StartRating";
import Avatar from "@/shared/Avatar";
import Badge from "@/shared/Badge";
import ButtonSecondary from "@/shared/ButtonSecondary";
import BusinessLikeSaveBtns from "@/components/BusinessLikeSaveBtns";
import ReviewsAndComments from "./ReviewsAndComments";
import SideBar from "./SideBar";
import HeaderAndGallery from "./HeaderAndGallery";
import {
  BuildingStorefrontIcon,
  InformationCircleIcon,
  Square2StackIcon,
  StarIcon,
  EnvelopeIcon,
  HomeIcon,
  GlobeAltIcon,
  PhoneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation as getTranslation } from "@/app/i18n";
import { getDetailBusiness } from "@/services/business";
import _ from "lodash";
import { cookies } from "next/headers";
import { APP_CONFIGS } from "@/config-global";
import RelatedBusiness from "../(components)/RelatedBusiness";
import ShowRatingStar from "@/components/ShowRatingStar";
import { notFound } from "next/navigation";
import { IClosedDay } from "@/models/iOpenHours";
import convertMillisecondsToTime from "@/utils/convertMillisecondsToTime";
import sortDaysOfWeek from "@/utils/sortDayOfWeek";
import RenderDayOfWeek from "@/components/RenderDayOfWeek";
import ShowOpenState from "@/components/ShowOpenState";
import BussinessThumbnail from "@/components/BusinessThumbnail";
import ToolTip from "@/shared/ToolTip";
import { STATUS_BUSINESS } from "@/constants/business";
import {
  BUSINESS_TYPE_SHOWER,
  BusinessTypeShowerKey,
} from "@/constants/business";
import { DescriptionDetail } from "../(components)/DescriptionDetail";
import { IBusiness } from "@/models/iBusiness";
import { linkify } from "@/utils/general";
import SlideModalMobile from "@/components/SlideModalMobile";
import { PATH_CLAIM, PATH_PAGE } from "@/contains/paths";
import SuggestionEdit from "./SuggestionEdit";

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
    lng: string;
  };
}) {
  const { t } = await getTranslation(params?.lng, ["homepage"]);
  const slug = params?.slug || "";
  // get data
  let detailData;

  try {
    detailData = await getDetailBusiness(slug);
  } catch (error) {
    console.error(
      "Error fetching detail business data in generateMetadata:",
      error,
    );
  }

  return {
    title:
      detailData?.title ||
      detailData?.names?.[params?.lng] ||
      detailData?.name ||
      t("heroTitle"),
    description: detailData?.description || t("heroDesc"),
    openGraph: {
      title:
        detailData?.title ||
        detailData?.names?.[params?.lng] ||
        detailData?.name ||
        t("heroTitle"),
      description: detailData?.description || t("heroDesc"),
      images: [detailData?.thumbnail || ""],
      type: "website",
    },
  };
}

// revalidate value
const HOUR = 3600;
export const revalidate = 3600;

const ListingStayDetailPage = async ({
  params,
}: {
  params: { slug: string; lng: string };
}) => {
  try {
    const { t, i18n } = await getTranslation(params?.lng, [
      "common",
      "detail",
      "addBusiness",
      "openHours",
    ]);
    const slug = params?.slug || "";
    const accessToken = cookies().get(APP_CONFIGS.keyToken)?.value;
    //
    let detailData: IBusiness;

    detailData = accessToken
      ? await getDetailBusiness(slug, accessToken)
      : await getDetailBusiness(slug);

    const renderTypeText = (type: string) => {
      // get key-value with value equal type
      const transKeyEntry = Object.entries(BUSINESS_TYPE_SHOWER).find(
        ([key, val]) => val === type,
      );
      // transKeyEntry return [key, value]
      const transKey = transKeyEntry
        ? (transKeyEntry[0] as BusinessTypeShowerKey)
        : null;

      return transKey;
    };

    const renderClaimStatus = () => {
      const hadClaimed =
        detailData.user_id && detailData.status === STATUS_BUSINESS.verified;
      return (
        <div className="">
          {hadClaimed ? (
            <div className="flex cursor-default items-center space-x-2">
              <span className="ml-1">
                <CheckCircleIcon className="inline-block h-6 w-6 text-primary-400" />
              </span>
              <p>{t("common:claimed")}</p>
            </div>
          ) : (
            <div className="flex cursor-default items-end space-x-2">
              <span className="ml-1">
                <InformationCircleIcon className="inline-block h-6 w-6 text-primary-400" />
              </span>
              <a
                href={PATH_CLAIM.claimVerify(detailData?.id || "")}
                className="hover:underline"
                target="_blank"
              >
                {t("common:unClaimed")}
              </a>
            </div>
          )}
        </div>
      );
    };

    const renderUnclaimToolTipDesktop = () => {
      return (
        <div className="space-y-3">
          <p className="font-semibold">{t("common:unClaimedTooltipText")}</p>
          <div>
            <a
              href={PATH_CLAIM.claimVerify(detailData?.id || "")}
              className="font-medium text-primary-400 dark:text-neutral-900 dark:underline"
            >
              {t("detail:claimThisBusiness")}
            </a>{" "}
            <span>{t("detail:toViewBusinessStatistics")}</span>
          </div>
        </div>
      );
    };

    // summary info
    const renderSection1 = () => {
      const hadClaimed =
        detailData.user_id && detailData.status === STATUS_BUSINESS.verified;

      return (
        <div className="listingSection__wrap !space-y-6">
          {/* 1 type */}
          <div className="flex items-center justify-between">
            {detailData?.types?.length ? (
              detailData?.types.slice(0, 2).map((item, index) => (
                <div key={index}>
                  <Badge
                    name={t(`addBusiness:types.${renderTypeText(item)}`)}
                  />
                </div>
              ))
            ) : (
              <div></div>
            )}
            <div className="flex flex-row items-center">
              <a
                href="#reviews"
                className="mx-3 flex cursor-pointer rounded-lg px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <StarIcon className="h-5 w-5" />
                <span className="ml-2.5 hidden sm:block">
                  {t("detail:writeReview")}
                </span>
              </a>
              <BusinessLikeSaveBtns
                isWishlist={detailData?.isWishlist}
                businessId={detailData?.id}
              />
            </div>
          </div>

          {/* 2 name */}
          <div className="grid grid-cols-12 gap-2 sm:gap-5">
            <div className="img_cover col-span-6 col-start-4 aspect-1 md:col-span-4 md:col-start-5 xl:col-span-3 xl:col-start-1">
              <BussinessThumbnail
                src={detailData?.thumbnail}
                alt=""
                fill
                className="min-w-full rounded-md border object-cover"
              />
            </div>
            <div className="col-span-12 flex flex-col justify-center gap-2 xl:col-span-9 xl:row-span-2">
              <h1 className="line-clamp-3 text-2xl font-semibold xl:text-3xl">
                {detailData?.names?.[i18n.language] || detailData?.name || ""}
              </h1>
              {detailData?.address?.displayed && (
                <span>
                  <i
                    className="las la-map-marker-alt"
                    style={{ fontSize: "20px" }}
                  ></i>
                  <span>
                    {`${detailData?.address?.displayed ?? ""}`}{" "}
                    <a
                      target="_blank"
                      href={`https://www.google.com/maps?q=${detailData?.location?.lat && detailData?.location?.lon ? `${detailData.location.lat},${detailData.location.lon}` : detailData?.address?.displayed}`}
                      className="text-sm text-gray-500 underline"
                    >
                      {t("detail:viewMap")}
                    </a>
                  </span>
                </span>
              )}

              {/* 3 State open */}
              <div className="flex flex-row space-x-3">
                {/* claimed status */}
                <div className="hidden lg:block">
                  {hadClaimed ? (
                    <ToolTip content={t("common:claimedTooltipText")}>
                      {renderClaimStatus()}
                    </ToolTip>
                  ) : (
                    <ToolTip content={renderUnclaimToolTipDesktop()}>
                      {renderClaimStatus()}
                    </ToolTip>
                  )}
                </div>

                <div className="lg:hidden">
                  <SlideModalMobile btnContent={renderClaimStatus()}>
                    <div className="listingSectionSidebar__wrap relative mb-6 border-none">
                      <div className="flex flex-row items-start justify-between gap-4">
                        <BuildingStorefrontIcon className="h-12 w-12 text-[#A4ACB6]" />
                      </div>

                      <div>
                        <p className="mb-2 text-lg font-semibold">
                          {t("common:unClaimedTooltipText")}
                        </p>
                        <span className="text-sm font-medium text-neutral-500">
                          {t("detail:claimDesc")}
                        </span>
                      </div>

                      <a
                        href={PATH_PAGE?.contact}
                        className="w-full rounded-md border px-4 py-2 text-center font-medium shadow-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-600"
                      >
                        {t("detail:claimButton")}
                      </a>
                    </div>
                  </SlideModalMobile>
                </div>

                {/* open status */}
                {detailData.open_hours.type === "mainHours" && (
                  <div className="flex items-center gap-2">
                    <i className=" las la-clock text-2xl "></i>
                    <ShowOpenState openHour={detailData.open_hours} />
                  </div>
                )}

                {/* 2 rating and address */}
                <div className="flex items-center space-x-4">
                  {!!detailData?.overview_rating?.average && (
                    <div className="flex items-end gap-2">
                      <ShowRatingStar
                        rating={detailData.overview_rating.average}
                      />
                      <p className="text-sm font-medium leading-none">
                        {`${detailData.overview_rating.average.toFixed(1)} (${detailData.overview_rating.total})`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 5 hosted */}
          {detailData?.owner && (
            <div className="flex items-center">
              <Avatar hasChecked sizeClass="h-10 w-10" radius="rounded-full" />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
                Hosted by{" "}
                <span className="font-medium text-neutral-900 dark:text-neutral-200">
                  {detailData?.owner}
                </span>
              </span>
            </div>
          )}

          {/* 6 */}
          <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />

          {/* 7 categories */}
          {detailData?.categories?.length > 0 && (
            <div className="items-centertext-sm flex flex-wrap justify-start gap-1 text-neutral-700 dark:text-neutral-300 xl:gap-3">
              {detailData?.categories.map((cats, index) => {
                return (
                  <div key={index}>
                    <Badge name={cats?.names?.[i18n.language]} color="green" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    };

    // contact
    const renderFullContact = (info: { type: string; value: string }) => {
      const linkStyle =
        "flex w-full items-center justify-between font-medium gap-3";
      const type = info?.type;
      switch (type) {
        case "email":
          return (
            <div className={`${linkStyle}`}>
              <span className="flex items-center gap-2">
                <EnvelopeIcon className="h-6 w-6" />
                {_.startCase(type)}
              </span>
              <a
                href={`mailto:${info.value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-[70%] truncate text-blue-600 hover:underline"
              >
                {info.value}
              </a>
            </div>
          );
        case "other":
          return (
            <div className={`${linkStyle}`}>
              <span className="flex items-center gap-2">
                <Square2StackIcon className="h-6 w-6" />
                {_.startCase(t(`common:${type}`))}
              </span>
              <a
                href={info?.value}
                target="_blank"
                className="line-clamp-2 text-blue-600 hover:underline"
              >
                {info.value}
              </a>
            </div>
          );
        case "homepage":
          return (
            <div className={`${linkStyle}`}>
              <span className="flex items-center gap-2">
                <HomeIcon className="h-6 w-6" />
                {_.startCase(t(`common:${type}`))}
              </span>
              <a
                href={linkify(info.value)}
                target="_blank"
                className="line-clamp-2 text-blue-600 hover:underline"
              >
                {info.value}
              </a>
            </div>
          );
        case "facebook":
          return (
            <div className={`${linkStyle}`}>
              <span className="flex items-center gap-2">
                <i
                  className="lab la-facebook-square"
                  style={{ fontSize: "24px" }}
                ></i>
                {_.startCase(type)}
              </span>
              <a
                href={linkify(info.value)}
                target="_blank"
                className="max-w-[70%] truncate text-blue-600 hover:underline"
              >
                {info.value}
              </a>
            </div>
          );
        case "linkedin":
          return (
            <div className={`${linkStyle}`}>
              <span className="flex items-center gap-2">
                <i className="lab la-linkedin" style={{ fontSize: "24px" }}></i>
                {_.startCase(type)}
              </span>
              <a
                href={linkify(info.value)}
                target="_blank"
                className="max-w-[70%] truncate text-blue-600 hover:underline"
              >
                {info.value}
              </a>
            </div>
          );
        case "mobile":
          return (
            <div className={`${linkStyle}`}>
              <span className="flex items-center gap-2">
                <PhoneIcon className="h-6 w-6" />
                {_.startCase(t(`common:${type}`))}
              </span>
              <a
                href={`tel:${info.value}`}
                className="text-blue-600 hover:underline"
              >
                {info.value}
              </a>
            </div>
          );
        case "phone":
          return (
            <div className={`${linkStyle}`}>
              <span className="flex items-center gap-2">
                <PhoneIcon className="h-6 w-6" />
                {_.startCase(t(`common:${type}`))}
              </span>
              <a
                href={`tel:${info.value}`}
                className="text-blue-600 hover:underline"
              >
                {info.value}
              </a>
            </div>
          );
        case "fax":
          return (
            <div className={`${linkStyle}`}>
              <span className="flex items-center gap-2">
                <PhoneIcon className="h-6 w-6" />
                {_.startCase(t(`common:${type}`))}
              </span>
              <a
                href={`tel:${info.value}`}
                className="text-blue-600 hover:underline"
              >
                {info.value}
              </a>
            </div>
          );
        case "website":
          return (
            <div className={`${linkStyle}`}>
              <span className="flex items-center gap-2">
                <GlobeAltIcon className="h-6 w-6" />
                {_.startCase(type)}
              </span>
              <a
                href={linkify(info.value)}
                target="_blank"
                className="max-w-[70%] truncate text-blue-600 hover:underline"
              >
                {info.value}
              </a>
            </div>
          );
        case "xcom":
          return (
            <div className={`${linkStyle}`}>
              <span className="flex items-center gap-2">
                <i className="lab la-twitter" style={{ fontSize: "24px" }}></i>
                {_.startCase(type)}
              </span>
              <a
                href={linkify(info.value)}
                target="_blank"
                className="max-w-[70%] truncate text-blue-600 hover:underline"
              >
                {info.value}
              </a>
            </div>
          );
      }
    };

    // section full contacts
    const renderSection3 = () => {
      if (detailData?.contacts?.length === 0) return;
      return (
        <div className="listingSection__wrap">
          {/* HEADING */}
          <div className=" flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{t("common:contacts")}</h2>
            <div className="block lg:hidden">
              <SuggestionEdit detailData={detailData} />
            </div>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

          {/* CONTENT */}
          <div>
            <div className="mt-3 w-full space-y-1 text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
              {detailData.contacts.map(
                (info, index) =>
                  info?.value && (
                    <div
                      key={index}
                      className={`space-x-10 rounded-lg ${index % 2 === 0 && "bg-neutral-100"} p-3 dark:bg-neutral-800`}
                    >
                      {renderFullContact(info)}
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      );
    };

    const renderTypeOpenHours = (type: string) => {
      switch (type) {
        case "mainHours":
          return (
            <p className="text-lg font-medium">
              {t("openHours:openMainHours")}
            </p>
          );
        case "noMainHours":
          return (
            <p className="text-lg font-medium">
              {t("openHours:openNoMainHours")}
            </p>
          );
        case "temporaryClosed":
          return (
            <p className="text-lg font-medium">
              {t("openHours:temporarilyClosed")}
            </p>
          );
        case "closed":
          return (
            <p className="text-lg font-medium">
              {t("openHours:permanentlyClosed")}
            </p>
          );
        default:
          return (
            <p className="text-lg font-medium">
              {t("openHours:openNoMainHours")}
            </p>
          );
      }
    };

    //Open time
    const renderOpenTimeSection = () => {
      return (
        <div className="listingSection__wrap">
          {/* HEADING */}
          <h2 className="text-2xl font-semibold">
            {t("addBusiness:stepTitle.openTime")}
          </h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

          {/* CONTENT */}
          <div className="mt-3 w-full space-y-1 text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
            {renderTypeOpenHours(detailData?.open_hours?.type)}
            {detailData?.open_hours?.type === "mainHours" &&
              Object.keys(
                sortDaysOfWeek(detailData?.open_hours?.dayOfWeek),
              ).map((day, index) => (
                <div
                  key={index}
                  className={`flex justify-between space-x-10 rounded-lg ${index % 2 === 0 && "bg-neutral-100"} p-3 dark:bg-neutral-800`}
                >
                  <p>
                    <RenderDayOfWeek day={day} />
                  </p>
                  <div className="space-y-2 text-end">
                    {detailData.open_hours.dayOfWeek[day as keyof IClosedDay]
                      .length > 0 ? (
                      detailData.open_hours.dayOfWeek[
                        day as keyof IClosedDay
                      ].map((item, index) => (
                        <p key={index}>
                          {convertMillisecondsToTime(item.from)} -{" "}
                          {convertMillisecondsToTime(item.to)}
                        </p>
                      ))
                    ) : (
                      <p>{t("common:closeBusiness")}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    };

    //room rates
    const renderSection4 = () => {
      return (
        <div className="listingSection__wrap">
          {/* HEADING */}
          <div>
            <h2 className="text-2xl font-semibold">Room Rates </h2>
            <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
              Prices may increase on weekends or holidays
            </span>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          {/* CONTENT */}
          <div className="flow-root">
            <div className="-mb-4 text-sm text-neutral-6000 dark:text-neutral-300 sm:text-base">
              <div className="flex items-center justify-between space-x-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
                <span>Monday - Thursday</span>
                <span>$199</span>
              </div>
              <div className="flex  items-center justify-between space-x-4 rounded-lg p-4">
                <span>Monday - Thursday</span>
                <span>$199</span>
              </div>
              <div className="flex items-center justify-between space-x-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
                <span>Friday - Sunday</span>
                <span>$219</span>
              </div>
              <div className="flex items-center justify-between space-x-4 rounded-lg p-4">
                <span>Rent by month</span>
                <span>-8.34 %</span>
              </div>
              <div className="flex items-center justify-between space-x-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
                <span>Minimum number of nights</span>
                <span>1 night</span>
              </div>
              <div className="flex items-center justify-between space-x-4 rounded-lg p-4">
                <span>Max number of nights</span>
                <span>90 nights</span>
              </div>
            </div>
          </div>
        </div>
      );
    };

    //owner infomation
    const renderSection5 = () => {
      return (
        <div className="listingSection__wrap">
          {/* HEADING */}
          <h2 className="text-2xl font-semibold">Host Information</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

          {/* host */}
          <div className="flex items-center space-x-4">
            <Avatar
              hasChecked
              hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
              sizeClass="h-14 w-14"
              radius="rounded-full"
            />
            <div>
              <a className="block text-xl font-medium" href="##">
                Kevin Francis
              </a>
              <div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                <StartRating />
                <span className="mx-2">·</span>
                <span> 12 places</span>
              </div>
            </div>
          </div>

          {/* desc */}
          <span className="block text-neutral-6000 dark:text-neutral-300">
            Providing lake views, The Symphony 9 Tam Coc in Ninh Binh provides
            accommodation, an outdoor swimming pool, a bar, a shared lounge, a
            garden and barbecue facilities...
          </span>

          {/* info */}
          <div className="block space-y-2.5 text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Joined in March 2016</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <span>Response rate - 100%</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>Fast response - within a few hours</span>
            </div>
          </div>

          {/* == */}
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
          <div>
            <ButtonSecondary href="/author">See host profile</ButtonSecondary>
          </div>
        </div>
      );
    };

    // location and map
    const renderSection7 = () => {
      return (
        <div className="listingSection__wrap" id="location">
          {/* HEADING */}
          <div>
            <h2 className="text-2xl font-semibold">{t("common:location")}</h2>
            <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
              {detailData?.address?.displayed}
            </span>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

          {/* MAP */}
          <div className="aspect-h-5 aspect-w-5 z-0 rounded-xl ring-1 ring-black/10 sm:aspect-h-3">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed?origin=mfe&pb=!1m4!2m1!1s${detailData?.location?.lat && detailData?.location?.lon ? `${detailData?.location?.lat},${detailData?.location?.lon}` : detailData.address.displayed}!4f15!5e0!6i10`}
            ></iframe>
          </div>
        </div>
      );
    };

    // notes
    const renderSection8 = () => {
      return (
        <div className="listingSection__wrap">
          {/* HEADING */}
          <h2 className="text-2xl font-semibold">Things to know</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

          {/* CONTENT */}
          <div>
            <h4 className="text-lg font-semibold">Cancellation policy</h4>
            <span className="mt-3 block text-neutral-500 dark:text-neutral-400">
              Refund 50% of the booking value when customers cancel the room
              within 48 hours after successful booking and 14 days before the
              check-in time. <br />
              Then, cancel the room 14 days before the check-in time, get a 50%
              refund of the total amount paid (minus the service fee).
            </span>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

          {/* CONTENT */}
          <div>
            <h4 className="text-lg font-semibold">Check-in time</h4>
            <div className="mt-3 max-w-md text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
              <div className="flex justify-between space-x-10 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
                <span>Check-in</span>
                <span>08:00 am - 12:00 am</span>
              </div>
              <div className="flex justify-between space-x-10 p-3">
                <span>Check-out</span>
                <span>02:00 pm - 04:00 pm</span>
              </div>
            </div>
          </div>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

          {/* CONTENT */}
          <div>
            <h4 className="text-lg font-semibold">Special Note</h4>
            <div className="prose sm:prose">
              <ul className="mt-3 space-y-2 text-neutral-500 dark:text-neutral-400">
                <li>
                  Ban and I will work together to keep the landscape and
                  environment green and clean by not littering, not using
                  stimulants and respecting people around.
                </li>
                <li>Do not sing karaoke past 11:30</li>
              </ul>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="nc-ListingStayDetailPage">
        {/* HEADER AND GALLERY */}
        <HeaderAndGallery detailData={detailData} />

        {/* MAIN */}
        <main className=" relative z-10 mt-11 flex flex-col lg:flex-row ">
          {/* CONTENT */}
          <div
            className={`w-full space-y-8 lg:mr-10 lg:w-3/5 lg:space-y-10 xl:w-2/3`}
          >
            {/* summary */}
            {renderSection1()}
            {/* business infomation */}
            {detailData?.description && (
              <DescriptionDetail
                title={t("detail:businessInfo")}
                description={detailData?.description}
              />
            )}
            {/* contact */}
            {renderSection3()}
            {detailData?.open_hours && renderOpenTimeSection()}
            {/* Amenities */}
            {/* <Amenities /> */}
            {/* schedule open hour*/}
            {/* {renderSection4()} */}
            {/* owner infomation */}
            {/* {renderSection5()} */}
            {/* review and comment */}
            <ReviewsAndComments
              businessId={detailData?.id ?? ""}
              overRating={detailData?.overview_rating}
            />
            {/* location and map */}
            {detailData?.address?.displayed && renderSection7()}
            {/* notes */}
            {/* {renderSection8()} */}
          </div>

          <SideBar detailData={detailData} />
        </main>
        <div className="py-24 lg:py-32">
          <RelatedBusiness businessId={slug} />
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("Get detail business error: ", error.message);
    notFound();
  }
};

export default ListingStayDetailPage;
