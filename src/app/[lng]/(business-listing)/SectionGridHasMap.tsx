"use client";

import React, { ChangeEvent, FC, useEffect, useState } from "react";
import AnyReactComponent from "@/components/AnyReactComponent/AnyReactComponent";
import GoogleMapReact from "google-map-react";
import ButtonClose from "@/shared/ButtonClose";
import Checkbox from "@/shared/CheckboxFilter";
import BusinessPagination from "@/shared/BusinessPagination";
import TabFilters from "./TabFilters";
import Heading2 from "@/shared/Heading2";
import BusinessCard2 from "@/components/BusinessCard2";
import { initialState } from "@/contexts/searchContext";
import useSupercluster from "use-supercluster";
import Marker from "@/components/AnyReactComponent/Marker";
import ShowFilter from "./ShowFilter";
import { useSearchParams } from "next/navigation";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";
import { filterKey, locationMap } from "@/contains/business";
import { APP_CONFIGS } from "@/config-global";
import { useTranslation } from "@/app/i18n/client";
import ListTypePropertyCard from "@/components/ListTypePropertyCard";
import { Switch } from "@headlessui/react";
import { Bars3Icon, Squares2X2Icon } from "@heroicons/react/24/solid";

export interface SectionGridHasMapProps {}

interface FilterTag {
  value: string;
  type: string;
}

const SectionGridHasMap: FC<SectionGridHasMapProps> = () => {
  const { t, i18n } = useTranslation(["common", "search"]);
  const { result, total, searchParams, facets, setFilter, isLoading } =
    useBusinessSearchContext();
  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const queryParams = useSearchParams();

  // gg map config
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);
  const [searchInMap, setSearchInMap] = useState(false);
  const [bounds, setBounds] = useState<number[] | null>(null);
  const [zoom, setZoom] = useState(7);

  // use in gg map
  const points = result
    .filter((result) => result?.location?.lat && result?.location?.lon)
    .map((result) => ({
      type: "Feature",
      properties: {
        cluster: false,
        crimeId: result?.id,
        result,
      },
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(String(result?.location?.lon)),
          parseFloat(String(result?.location?.lat)),
        ],
      },
    }));

  // type result show
  const [isListResult, setIsListResult] = useState(false);

  // to show filter tag
  const [arrFilterTag, setArrFiterTag] = useState<FilterTag[]>([]);

  // set filterTag is empty when not have result
  useEffect(() => {
    if (!result.length) {
      setArrFiterTag([]);
    }
  }, [result]);

  // set scroll to top when change pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams?.start]);

  // handle set single tag
  const handleSetFilterTag = (
    newTag: { value: string; type: string },
    removeFilter?: boolean,
  ) => {
    if (removeFilter) {
      const updatedFilterTags = arrFilterTag.filter(
        (tag) => tag.value !== newTag.value || tag.type !== newTag.type,
      );
      setArrFiterTag(updatedFilterTags);
    } else {
      setArrFiterTag([...arrFilterTag, newTag]);
    }
  };

  // get filter Tag when first load
  useEffect(() => {
    const getShowFilterTag = (): FilterTag[] => {
      return filterKey.reduce<FilterTag[]>((acc, key) => {
        const values = queryParams?.get(key)?.split(",") ?? [];
        const taggedValues = values
          .filter((value) => value.trim() !== "")
          .map((value) => ({
            value,
            type: key,
          }));
        return acc.concat(taggedValues);
      }, []);
    };

    const arrFilter = getShowFilterTag();
    setArrFiterTag(arrFilter);
  }, []);

  //set up clusters use in map
  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  // handle search when move map
  const handleSearchMap = (e: ChangeEvent<HTMLInputElement>) => {
    const newLocationMap = locationMap.reduce(
      (acc, key) => {
        acc[key] = "";
        return acc;
      },
      {} as { [key: string]: string },
    );
    const { checked } = e.target;
    if (checked) {
      setSearchInMap(true);
    } else {
      setZoom(7);
      setSearchInMap(false);
      setFilter(newLocationMap);
    }
  };

  const renderContent = () => {
    // check loading data
    if (isLoading) {
      return isListResult ? (
        <div className="nc-ListTypePropertyCard group relative flex animate-pulse flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:border-neutral-700 dark:bg-neutral-900 sm:flex-row sm:items-start">
          {/* Images Slide */}
          <div className="h-64 w-full shrink-0 rounded-2xl bg-gray-200 p-3 sm:w-64">
            <div className="h-full w-full rounded-2xl bg-gray-300" />
          </div>

          {/* Content */}
          <div className="flex grow flex-col items-start p-3 sm:pr-6">
            <div className="w-full space-y-4">
              <div className="flex flex-1 flex-wrap items-center gap-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-24 rounded-full bg-gray-200"
                  ></div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-6 w-3/4 rounded bg-gray-200"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-32 rounded bg-gray-200"></div>
              </div>
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="w-14 border-b border-neutral-200/80 dark:border-neutral-700" />
              <div className="flex w-full items-end justify-between">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:gap-x-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="group relative flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            >
              {/* Images Slide */}
              <div className="relative h-64 w-full rounded-lg bg-gray-200">
                <div className="absolute right-3 top-3 z-[1] h-10 w-10 rounded-full bg-gray-300"></div>
              </div>

              {/* Content */}
              <div className="mt-3 flex flex-col space-y-3 px-3 pb-2">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-3/4 rounded bg-gray-200"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-12 rounded bg-gray-200"></div>
                    <div className="h-4 w-24 rounded bg-gray-200"></div>
                  </div>
                  <div className="flex flex-1 flex-wrap items-center gap-1">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-6 w-24 rounded-full bg-gray-200"
                      ></div>
                    ))}
                  </div>
                  <div className="flex items-start space-x-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="h-4 w-4 min-w-max rounded bg-gray-200"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // check have result
    if (result?.length === 0) {
      return (
        <div className="text-center">
          <p className="text-xl font-semibold">{t("search:notResult")}</p>
          <p className="my-3 text-neutral-500">{t("search:clickReset")}</p>
          <button
            className="cursor-pointer rounded-full border border-primary-500 bg-primary-50 px-4 py-2 text-sm text-primary-700 hover:bg-primary-100 focus:outline-none"
            onClick={() => setFilter(initialState.searchParams)}
          >
            {t("search:resetFilter")}
          </button>
        </div>
      );
    }

    // list style view
    if (isListResult) {
      return (
        <div className="space-y-2">
          {result.map((item, index) => (
            <div
              key={item?.id || index}
              onMouseEnter={() => setCurrentHoverID((_) => item?.id)}
              onMouseLeave={() => setCurrentHoverID((_) => -1)}
            >
              <ListTypePropertyCard data={item} lng={i18n.language} />
            </div>
          ))}
        </div>
      );
    }

    // gird style view
    return (
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:gap-x-6">
        {result.map((item, index) => (
          <div
            key={item?.id || index}
            onMouseEnter={() => setCurrentHoverID((_) => item?.id)}
            onMouseLeave={() => setCurrentHoverID((_) => -1)}
          >
            <BusinessCard2 data={item} lng={i18n.language} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="relative flex min-h-screen">
        {/* CARDSSSS */}
        <div className="mt-3 min-h-screen w-full max-w-[1184px] shrink-0 lg:mt-0 xl:w-3/5 xl:px-8 2xl:w-3/5">
          <div className="mb-4 hidden flex-row items-center gap-3 lg:flex">
            <div className="min-w-max">
              <Heading2
                className="!mb-4"
                heading=""
                subHeading={
                  <span className="mt-3 block text-neutral-500 dark:text-neutral-400">
                    {`${total?.value ?? 0} ${t("common:results")}`}
                  </span>
                }
              />
            </div>
            <ShowFilter
              arrFilterTag={arrFilterTag}
              arrFacets={[
                ...(facets?.countries ?? []),
                ...(facets?.categories ?? []),
              ]}
              setArrFiterTag={handleSetFilterTag}
              setMoreFiterTag={setArrFiterTag}
            />
          </div>
          <div className="mb-8 lg:mb-11 lg:flex lg:items-center lg:justify-between">
            <TabFilters
              arrFilterTag={arrFilterTag}
              setArrFiterTag={handleSetFilterTag}
              setMoreFiterTag={setArrFiterTag}
            />
            <div className="mt-3 lg:hidden">
              <ShowFilter
                arrFilterTag={arrFilterTag}
                arrFacets={[
                  ...(facets?.countries ?? []),
                  ...(facets?.categories ?? []),
                ]}
                setArrFiterTag={handleSetFilterTag}
                setMoreFiterTag={setArrFiterTag}
              />
            </div>
            <Switch
              checked={isListResult}
              onClick={() => setIsListResult(!isListResult)}
              className={`group relative hidden h-9 w-16 items-center justify-between rounded-full bg-neutral-300 transition-colors duration-200 ease-in-out dark:bg-white lg:inline-flex`}
            >
              <span
                className={`absolute inline-block h-7 w-7 rounded-full bg-gray-500 transition-transform duration-200 ease-in-out ${
                  isListResult ? "translate-x-8" : "translate-x-1"
                }`}
              />
              <span className="absolute left-1 flex h-7 w-7 items-center justify-center text-gray-500 transition-opacity duration-200 ease-in-out">
                <Squares2X2Icon
                  className={`h-5 w-5 ${!isListResult && "text-neutral-50"}`}
                />
              </span>
              <span className="absolute right-1 flex h-7 w-7 items-center justify-center text-gray-500 transition-opacity duration-200 ease-in-out">
                <Bars3Icon
                  className={`h-5 w-5 ${isListResult && "text-neutral-50"}`}
                />
              </span>
            </Switch>
          </div>
          {renderContent()}

          <div className="mt-16 flex items-center justify-center">
            <BusinessPagination />
          </div>
        </div>

        {!showFullMapFixed && (
          <div
            className={`fixed bottom-16 left-1/2 z-30 flex -translate-x-1/2 cursor-pointer items-center justify-center space-x-3 rounded-full bg-neutral-900 px-6 py-2 text-sm text-white shadow-2xl  md:bottom-8 xl:hidden`}
            onClick={() => setShowFullMapFixed(true)}
          >
            <i className="las la-map text-lg"></i>
            <span>{t("search:showMap")}</span>
          </div>
        )}

        {/* MAPPPPP */}
        <div
          className={`xl:static xl:block xl:flex-1 ${
            showFullMapFixed ? "fixed inset-0 z-50" : "invisible xl:visible"
          }`}
        >
          {showFullMapFixed && (
            <ButtonClose
              onClick={() => setShowFullMapFixed(false)}
              className="absolute left-3 top-3 z-50 h-10 w-10 rounded-xl bg-white shadow-lg"
            />
          )}

          <div className="fixed left-0 top-0 h-full w-full overflow-hidden rounded-md xl:sticky xl:top-[88px] xl:h-[calc(100vh-88px)]">
            <div className="absolute bottom-5 left-3 z-10 min-w-max rounded-2xl bg-white px-4 py-2 shadow-xl dark:bg-neutral-800 lg:bottom-auto lg:left-1/2 lg:top-2.5 lg:-translate-x-1/2">
              <Checkbox
                className="text-xs xl:text-sm"
                name="xx"
                label={t("search:searchMovingMap")}
                onChange={(e) => {
                  handleSearchMap(e);
                }}
              />
            </div>
            <GoogleMapReact
              onChange={({ zoom, bounds }) => {
                setZoom(zoom);
                setBounds([
                  bounds?.nw?.lng,
                  bounds?.se?.lat,
                  bounds?.se?.lng,
                  bounds?.nw?.lat,
                ]);
                searchInMap &&
                  setFilter({
                    top_left: `${bounds?.nw?.lat},${bounds?.nw?.lng}`,
                    bottom_right: `${bounds?.se?.lat},${bounds?.se?.lng}`,
                  });
              }}
              zoom={zoom}
              center={{
                lat:
                  result.find(
                    (result) => result?.location?.lat && result?.location?.lon,
                  )?.location?.lat || 0,
                lng:
                  result.find(
                    (result) => result?.location?.lat && result?.location?.lon,
                  )?.location?.lon || 0,
              }}
              defaultCenter={{
                lat:
                  result.find(
                    (result) => result?.location?.lat && result?.location?.lon,
                  )?.location?.lat || 0,
                lng:
                  result.find(
                    (result) => result?.location?.lat && result?.location?.lon,
                  )?.location?.lon || 0,
              }}
              bootstrapURLKeys={{
                key: APP_CONFIGS.googleMapKey,
              }}
              yesIWantToUseGoogleMapApiInternals
            >
              {clusters.map((cluster: any, index: number) => {
                const [longitude, latitude] = cluster?.geometry?.coordinates;
                const {
                  cluster: isCluster,
                  point_count: pointCount,
                  result,
                } = cluster?.properties;

                if (isCluster) {
                  return (
                    <Marker
                      key={`cluster-${cluster?.id}`}
                      lat={latitude}
                      lng={longitude}
                    >
                      <div
                        className="flex items-center justify-center rounded-[50%] bg-[#1978c8] p-3 text-white"
                        style={{
                          width: `${10 + (pointCount / points?.length) * 40}px`,
                          height: `${10 + (pointCount / points?.length) * 40}px`,
                        }}
                      >
                        {pointCount}
                      </div>
                    </Marker>
                  );
                }

                return (
                  <Marker
                    key={`crime-${cluster?.properties?.crimeId}`}
                    lat={latitude}
                    lng={longitude}
                  >
                    <AnyReactComponent
                      mark={index + 1}
                      isSelected={currentHoverID === result?.id}
                      key={cluster?.id}
                      lat={longitude ?? 0}
                      lng={latitude ?? 0}
                      listing={result}
                    />
                  </Marker>
                );
              })}
            </GoogleMapReact>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionGridHasMap;
