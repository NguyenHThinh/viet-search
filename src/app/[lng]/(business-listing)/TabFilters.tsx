"use client";

import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonClose from "@/shared/ButtonClose";
import Checkbox from "@/shared/CheckboxFilter";
import { iCountryCode, iCategory } from "@/models/iFacets";
import API from "@/utils/api";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";
import { filterKey } from "@/contains/business";
import { useTranslation } from "@/app/i18n/client";
import { getFilter } from "@/services/search";
import { FunnelIcon } from "@heroicons/react/24/outline";

const TabFilters = ({
  arrFilterTag,
  setArrFiterTag,
  setMoreFiterTag,
}: {
  arrFilterTag: { value: string; type: string }[];
  setArrFiterTag: (
    newTag: { value: string; type: string },
    removeFilter?: boolean,
  ) => void;
  setMoreFiterTag: (newTag: { value: string; type: string }[]) => void;
}) => {
  const { t } = useTranslation(["common", "search"]);
  const { facets, searchParams, setFilter } = useBusinessSearchContext();
  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  const [isOpenMoreFilterMobile, setisOpenMoreFilterMobile] = useState(false);
  const [moreFilterCount, setMoreFilterCount] = useState(0);

  const [facetsData, setFacetsData] = useState<{ [key: string]: any }>({});

  const [newArrFilterTag, setNewArrFilterTag] = useState<
    { value: string; type: string }[]
  >([]);

  const [queryValues, setQueryValues] = useState<{ [key: string]: string }>({
    countries: "",
    categories: "",
    types: "",
  });

  const emptyQueryValues = filterKey.reduce<Record<string, string>>(
    (acc, curr) => {
      acc[curr] = "";
      return acc;
    },
    {},
  );

  const initialTabStates: { [key: string]: boolean } = Object.keys(
    queryValues,
  ).reduce(
    (acc, key) => {
      acc[key] = false;
      return acc;
    },
    {} as { [key: string]: boolean },
  );

  const [isOpenSingleFilter, setisOpenSingleFilter] =
    useState(initialTabStates);

  useEffect(() => {
    setNewArrFilterTag(arrFilterTag);
    setMoreFilterCount(arrFilterTag.length);
  }, [arrFilterTag]);

  //
  const closeModalMoreFilter = () => {
    setQueryValues(emptyQueryValues);
    setisOpenMoreFilter(false);
  };
  const openModalMoreFilter = () => setisOpenMoreFilter(true);

  //
  const closeModalMoreFilterMobile = () => {
    setQueryValues(emptyQueryValues);
    setisOpenMoreFilterMobile(false);
  };
  const openModalMoreFilterMobile = () => setisOpenMoreFilterMobile(true);

  useEffect(() => {
    setQueryValues({
      categories: searchParams?.categories ?? "",
      countries: searchParams?.countries ?? "",
      types: searchParams?.types ?? "",
    });
  }, [searchParams?.countries, searchParams?.categories, searchParams?.types]);

  const fetchDataFullFacets = async (key: string) => {
    const data: { [key: string]: any } = {};
    try {
      const response = await getFilter(searchParams, key);
      data[key] = response?.facets?.[key];
    } catch (error) {
      console.error(`Error fetching facets for ${key}:`, error);
      data[key] = [];
    }
    setFacetsData(data);
  };

  const handleCheckBoxChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    const { name, checked } = e.target;
    const currentValues = searchParams?.[key]
      ? searchParams?.[key].split(",")
      : [];
    if (!checked) {
      const updatedValues = currentValues.filter((value) => value !== name);
      const updatedParam = updatedValues.join(",");
      setFilter({
        [key]: updatedParam,
      });
      setArrFiterTag({ value: name, type: key }, true);
      return;
    }
    setArrFiterTag({ value: name, type: key });
    setFilter({
      [key]: searchParams?.[key]
        ? searchParams?.[key]?.concat(",", name)
        : name,
    });
  };

  const handleMoreFilterChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    const { name, checked } = e.target;
    const newName = key === "countries" ? name.toUpperCase() : name;
    setNewArrFilterTag((prev) => {
      if (checked) {
        return [...prev, { value: newName, type: key }];
      } else {
        return prev.filter((tag) => tag?.value !== newName || tag.type !== key);
      }
    });
    setQueryValues((prev) => {
      const currentValues = prev[key] ? prev[key].split(",") : [];

      if (checked) {
        const newValues = currentValues.concat(newName).filter(Boolean);
        return {
          ...prev,
          [key]: newValues.join(","),
        };
      } else {
        const newValues = currentValues
          .filter((value) => value !== newName)
          .filter(Boolean);
        return {
          ...prev,
          [key]: newValues.join(","),
        };
      }
    });
  };

  const clearAllFilter = () => {
    const handleResetFilter = () => {
      closeModalMoreFilter();
      setMoreFiterTag([]);
      setFilter(emptyQueryValues);
    };

    return (
      <button
        onClick={handleResetFilter}
        className={`flex items-center justify-center rounded-full border border-red-700 bg-red-700 px-4 py-2 text-sm text-white hover:bg-red-400 focus:outline-none dark:border-neutral-700 dark:hover:border-neutral-6000`}
      >
        <span>{t("common:clearAll")}</span>
      </button>
    );
  };

  const RenderTabsContries = () => {
    const countrySelectedArr = searchParams?.countries?.length
      ? searchParams?.countries.split(",")
      : [];

    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none dark:border-neutral-700 dark:hover:border-neutral-6000 
                ${open ? "!border-primary-500 " : ""} 
                ${searchParams?.countries ? "border-primary-500 bg-primary-50 text-primary-700" : "hover:border-neutral-400"}`}
            >
              <span>
                {t("common:countries")}
                {countrySelectedArr?.length
                  ? ` (${countrySelectedArr?.length})`
                  : ""}
              </span>
              <i className="las la-angle-down ml-2"></i>
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
              <Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-sm px-4 sm:px-0 lg:max-w-md">
                {facets?.categories?.length ? (
                  <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="relative flex max-h-[320px] flex-col space-y-5 overflow-y-auto overscroll-contain px-5 py-6">
                      {facets?.countries?.map((item) => (
                        <div key={item.key} className="">
                          <Checkbox
                            name={item?.key.toUpperCase()}
                            label={`${item?.names?.[searchParams?.lang ?? "en"] ?? ""} (${item?.doc_count})`}
                            // subLabel={item?.value?.vi}
                            defaultChecked={countrySelectedArr.includes(
                              item?.key.toUpperCase(),
                            )}
                            onChange={(e) => {
                              handleCheckBoxChange(e, "countries");
                              close();
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {facets?.countries?.length > 11 && (
                      <div className="flex shrink-0 items-center justify-end bg-neutral-50 px-6 py-3 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                        <ButtonPrimary
                          onClick={() => {
                            setisOpenSingleFilter((prev) => ({
                              ...prev,
                              countries: true,
                            }));
                            fetchDataFullFacets("countries");
                            close();
                          }}
                          sizeClass="px-4 py-2 sm:px-5"
                        >
                          {t("common:seeAll")}
                        </ButtonPrimary>
                      </div>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const RenderTabsCategory = () => {
    const catsSelectedArr = searchParams?.categories?.length
      ? searchParams?.categories.split(",")
      : [];

    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-sm focus:outline-none dark:border-neutral-700 dark:hover:border-neutral-6000 
                ${open ? "!border-primary-500 " : ""} 
                ${searchParams?.categories ? "border-primary-500 bg-primary-50 text-primary-700" : "hover:border-neutral-400"}`}
            >
              <span>
                {t("common:categories")}
                {catsSelectedArr?.length ? ` (${catsSelectedArr.length})` : ""}
              </span>
              <i className="las la-angle-down ml-2"></i>
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
              <Popover.Panel className="absolute left-0 z-10 mt-3 w-screen max-w-sm px-4 sm:px-0 lg:max-w-md">
                {facets?.categories?.length ? (
                  <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="relative flex max-h-[320px] flex-col space-y-5 overflow-y-auto overscroll-contain px-5 py-6">
                      {facets?.categories?.map((item) => (
                        <div key={item.key} className="">
                          <Checkbox
                            name={item?.key}
                            label={`${item?.names?.[searchParams?.lang ?? "en"] ?? item?.name ?? ""} (${item?.doc_count})`}
                            // subLabel={item?.value?.en}
                            defaultChecked={catsSelectedArr.includes(item?.key)}
                            onChange={(e) => {
                              handleCheckBoxChange(e, "categories");
                              close();
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {facets?.categories?.length > 11 && (
                      <div className="flex shrink-0 items-center justify-end bg-neutral-50 px-5 py-3 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                        <ButtonPrimary
                          onClick={() => {
                            setisOpenSingleFilter((prev) => ({
                              ...prev,
                              categories: true,
                            }));
                            fetchDataFullFacets("categories");
                            close();
                          }}
                          sizeClass="px-4 py-2 sm:px-5"
                        >
                          {t("common:seeAll")}
                        </ButtonPrimary>
                      </div>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderMoreFilterItem = (
    data: iCountryCode[] | iCategory[],
    key: string,
  ) => {
    const list1 = data?.length
      ? data.filter((_, i) => i < data.length / 2)
      : [];
    const list2 = data?.length
      ? data.filter((_, i) => i >= data.length / 2)
      : [];
    const queryArr = searchParams?.[key]?.length
      ? searchParams?.[key].split(",")
      : [];

    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col space-y-5">
          {list1.map((item) => (
            <Checkbox
              key={item?.key}
              name={item?.key}
              label={`${item?.names?.[searchParams?.lang ?? "en"] ?? ""} (${item?.doc_count})`}
              // subLabel={item?.value?.vi}
              defaultChecked={
                !!queryArr.find((i) => i.toLowerCase() === item.key)
              }
              onChange={(e) => {
                handleMoreFilterChange(e, key);
              }}
            />
          ))}
        </div>
        <div className="flex flex-col space-y-5">
          {list2.map((item) => (
            <Checkbox
              key={item?.key}
              name={item?.key}
              label={`${item?.names?.[searchParams?.lang ?? "en"] ?? ""} (${item?.doc_count})`}
              defaultChecked={
                !!queryArr.find((i) => i.toLowerCase() === item.key)
              }
              onChange={(e) => {
                handleMoreFilterChange(e, key);
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTabMoreFilter = () => {
    return (
      <div>
        <div
          className={`flex cursor-pointer items-center justify-center rounded-full border border-primary-500 bg-primary-50 px-4 py-2 text-sm text-primary-700 focus:outline-none`}
          onClick={openModalMoreFilter}
        >
          <FunnelIcon className="mr-2 h-5 w-5" />
          <span>
            {t("common:moreFilter")}{" "}
            {moreFilterCount ? `(${moreFilterCount})` : ""}
          </span>
          {/* <i className="las la-angle-down ml-2"></i> */}
        </div>

        <Transition appear show={isOpenMoreFilter} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={closeModalMoreFilter}
          >
            <div className="min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                className="inline-block h-screen w-full max-w-4xl px-2 py-8"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all dark:border dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                  <div className="relative shrink-0 border-b border-neutral-200 px-6 py-4 text-center dark:border-neutral-800">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {t("common:moreFilter")}
                    </Dialog.Title>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalMoreFilter} />
                    </span>
                  </div>

                  <div className="grow overflow-y-auto">
                    {facets?.countries?.length && (
                      <div className="divide-y divide-neutral-200 px-10 dark:divide-neutral-800">
                        <div className="py-7">
                          <h3 className="text-xl font-medium">
                            {t("common:countries")}
                          </h3>
                          <div className="relative mb-3 mt-6">
                            {renderMoreFilterItem(
                              facets?.countries ?? [],
                              "countries",
                            )}
                          </div>
                          <div onClick={closeModalMoreFilter}>
                            {facets?.countries?.length > 11 &&
                              renderSingleFilter("countries")}
                          </div>
                        </div>
                      </div>
                    )}
                    {facets?.categories?.length && (
                      <div className="divide-y divide-neutral-200 px-10 dark:divide-neutral-800">
                        <div className="py-7">
                          <h3 className="text-xl font-medium">
                            {t("common:categories")}
                          </h3>
                          <div className="relative mb-3 mt-6">
                            {renderMoreFilterItem(
                              facets?.categories ?? [],
                              "categories",
                            )}
                          </div>
                          <div onClick={closeModalMoreFilter}>
                            {facets?.categories?.length > 11 &&
                              renderSingleFilter("categories")}
                          </div>
                        </div>
                      </div>
                    )}
                    {facets?.types?.length && (
                      <div className="divide-y divide-neutral-200 px-10 dark:divide-neutral-800">
                        <div className="py-7">
                          <h3 className="text-xl font-medium">
                            {t("common:types")}
                          </h3>
                          <div className="relative mb-3 mt-6">
                            {renderMoreFilterItem(facets?.types ?? [], "types")}
                          </div>
                          <div onClick={closeModalMoreFilter}>
                            {facets?.types?.length > 11 &&
                              renderSingleFilter("types")}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center justify-between bg-neutral-50 p-6 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                    {clearAllFilter()}
                    <ButtonPrimary
                      onClick={() => {
                        setMoreFiterTag(newArrFilterTag);
                        setFilter(queryValues);
                        closeModalMoreFilter();
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      {t("common:apply")}
                    </ButtonPrimary>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };

  const renderSingleFilter = (key: string) => {
    return (
      <div key={key}>
        <div
          className="w-max cursor-pointer items-center justify-center text-base font-medium text-primary-700 hover:underline focus:outline-none"
          onClick={() => {
            setisOpenSingleFilter((prev) => ({
              ...prev,
              [key]: true,
            }));
            fetchDataFullFacets(key);
          }}
        >
          <span>{t("common:seeAll")}</span>
        </div>

        <Transition appear show={isOpenSingleFilter[key]} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={() =>
              setisOpenSingleFilter({ ...isOpenSingleFilter, [key]: false })
            }
          >
            <div className="min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                className="inline-block h-screen w-full max-w-4xl px-2 py-8"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all dark:border dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                  <div className="relative shrink-0 border-b border-neutral-200 px-6 py-4 text-center dark:border-neutral-800">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {key}
                    </Dialog.Title>
                    <span className="absolute left-3 top-3">
                      <ButtonClose
                        onClick={() =>
                          setisOpenSingleFilter({
                            ...isOpenSingleFilter,
                            [key]: false,
                          })
                        }
                      />
                    </span>
                  </div>

                  <div className="grow overflow-y-auto">
                    <div className="divide-y divide-neutral-200 px-10 dark:divide-neutral-800">
                      <div className="py-7">
                        <div className="relative">
                          {renderMoreFilterItem(facetsData?.[key], key)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center justify-end bg-neutral-50 p-6 dark:border-t dark:border-neutral-800 dark:bg-neutral-900">
                    <ButtonPrimary
                      onClick={() => {
                        setMoreFiterTag(newArrFilterTag);
                        setFilter(queryValues);
                        setisOpenSingleFilter({
                          ...isOpenSingleFilter,
                          [key]: false,
                        });
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      {t("common:apply")}
                    </ButtonPrimary>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };

  const renderTabMoreFilterMobile = () => {
    return (
      <div>
        <div
          className={`flex cursor-pointer items-center justify-center rounded-full border border-primary-500 bg-primary-50 px-4 py-2 text-sm text-primary-700 focus:outline-none lg:hidden`}
          onClick={openModalMoreFilterMobile}
        >
          <FunnelIcon className="mr-2 h-5 w-5" />
          <span>
            {t("common:filter")}{" "}
            {arrFilterTag?.length ? `(${arrFilterTag.length})` : ""}
          </span>
          <i className="las la-angle-down ml-2"></i>
        </div>

        <Transition appear show={isOpenMoreFilterMobile} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={closeModalMoreFilterMobile}
          >
            <div className="min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                className="inline-block h-screen w-full max-w-4xl px-2 py-8"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all dark:border dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                  <div className="relative shrink-0 border-b border-neutral-200 px-6 py-4 text-center dark:border-neutral-800">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {t("common:moreFilter")}
                    </Dialog.Title>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalMoreFilterMobile} />
                    </span>
                  </div>

                  <div className="grow overflow-y-auto">
                    <div className="divide-y divide-neutral-200 px-4 dark:divide-neutral-800 sm:px-6">
                      {/* ---- */}
                      <div className="py-7">
                        <h3 className="text-xl font-medium">
                          {t("common:countries")}
                        </h3>
                        <div className="relative mb-3 mt-6">
                          {renderMoreFilterItem(
                            facets?.countries ?? [],
                            "countries",
                          )}
                        </div>
                        <div onClick={closeModalMoreFilterMobile}>
                          {facets?.countries?.length > 11 &&
                            renderSingleFilter("countries")}
                        </div>
                      </div>

                      {/* ---- */}
                      <div className="py-7">
                        <h3 className="text-xl font-medium">
                          {t("common:categories")}
                        </h3>
                        <div className="relative mb-3 mt-6">
                          {renderMoreFilterItem(
                            facets?.categories ?? [],
                            "categories",
                          )}
                        </div>
                        <div onClick={closeModalMoreFilterMobile}>
                          {facets?.categories?.length > 11 &&
                            renderSingleFilter("categories")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-end bg-neutral-50 p-4 dark:border-t dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
                    <ButtonPrimary
                      onClick={() => {
                        setMoreFiterTag(newArrFilterTag);
                        setFilter(queryValues);
                        closeModalMoreFilterMobile();
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      {t("common:apply")}
                    </ButtonPrimary>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };

  const renderTabSingleFilter = () => {
    return Object.keys(queryValues).map((key) => (
      <div key={key} className="hidden">
        {renderSingleFilter(key)}
      </div>
    ));
  };

  return (
    <div className="flex lg:space-x-4">
      <div className="hidden space-x-4 lg:flex lg:flex-1">
        {facets?.countries && RenderTabsContries()}
        {facets?.categories && RenderTabsCategory()}
        {renderTabMoreFilter()}
        {renderTabSingleFilter()}
      </div>
      {renderTabMoreFilterMobile()}
    </div>
  );
};

export default TabFilters;
