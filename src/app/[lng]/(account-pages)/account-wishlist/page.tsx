"use client";

import React, { useEffect, useState } from "react";
import { businessTypes } from "@/contains/business";
import _ from "lodash";
import { useQuery } from "@tanstack/react-query";
import BusinessCard2 from "@/components/BusinessCard2";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteWishList, getWishlist } from "@/services/wishlist";
import { IBusiness } from "@/models/iBusiness";
import WishlistPagination from "@/shared/WishlistPagination";
import { PATH_USER_DASHBOARD } from "@/contains/paths";
import Select from "@/shared/Select";
import { useTranslation } from "@/app/i18n/client";
import { BUSINESS_TYPE, BusinessTypeKey } from "@/constants/business";

const WishlistPage = () => {
  const { t, i18n } = useTranslation(["wishlist", "common", "addBusiness"]);
  const router = useRouter();
  const searchParams = useSearchParams();

  //
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [totalPage, setTotalPage] = useState(1);
  const [businessType, setBusinessType] = useState(
    searchParams.get("type") || "",
  );
  const [results, setResults] = useState<IBusiness[]>([]);

  //
  const handleChangeType = (type: string) => {
    setResults([]);
    setBusinessType(type);
    // reset page when change busines type
    setCurrentPage(1);
    if (!type) {
      router.push(PATH_USER_DASHBOARD.accountWishlist, { scroll: false });
      return;
    }
    router.push(`?type=${type}`, { scroll: false });
  };

  //
  const handleChangePage = (newPage: number) => {
    setResults([]);
    setCurrentPage(newPage);
    // check have type or get all
    if (!businessType) {
      // check page 1
      if (newPage === 1) {
        router.push(PATH_USER_DASHBOARD.accountWishlist, { scroll: false });
        return;
      }
      router.push(`?page=${newPage}`, { scroll: false });
    } else {
      // check page 1
      if (newPage === 1) {
        router.push(`?type=${businessType}`, { scroll: false });
        return;
      }
      router.push(`?type=${businessType}&page=${newPage}`, { scroll: false });
    }
  };

  //
  const handleGetWishlist = async (page: number, type: string) => {
    const data = await getWishlist(page, type);
    setTotalPage(data?.totalPages);
    return data?.results;
  };

  //
  const { data, isLoading, refetch } = useQuery<IBusiness[]>({
    queryKey: ["wishlist", currentPage, businessType],
    queryFn: () => handleGetWishlist(currentPage, businessType),
  });

  // remove wishlist item
  const handleRemoveWishlist = async (businessId: string) => {
    await deleteWishList(businessId);
    refetch();
  };

  useEffect(() => {
    data && setResults(data);
  }, [data]);

  const renderSection1 = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">{t("wishlist:wishlist")}</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div>
          <Select
            defaultValue={businessType}
            onChange={(e) => handleChangeType(e.target.value)}
            className="w-max text-sm font-medium"
          >
            <option
              value=""
              className="block shrink-0 rounded-full px-5 py-2.5 text-sm font-medium capitalize !leading-none focus:outline-none sm:px-6 sm:py-3 sm:text-base"
            >
              {t("common:all")}
            </option>
            {Object.keys(BUSINESS_TYPE).map((key) => {
              const typedKey = key as BusinessTypeKey;
              return (
                <option key={typedKey} value={BUSINESS_TYPE[typedKey] || ""}>
                  {t(`addBusiness:types.${typedKey}`) ?? ""}
                </option>
              );
            })}
          </Select>
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-gray-200"></div>
            </div>
          )}
          {results.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {results.length > 0 &&
                results.map((item) => (
                  <div key={item.id}>
                    <BusinessCard2
                      data={item}
                      lng={i18n.language}
                      onRemoveWishlist={handleRemoveWishlist}
                    />
                  </div>
                ))}
            </div>
          ) : (
            !isLoading && (
              <div className="mt-5 w-full text-center">
                <span className="text-xl font-medium text-neutral-700">
                  {t("wishlist:nothingHere")}
                </span>
              </div>
            )
          )}
        </div>
        {totalPage > 1 && !isLoading && (
          <div className="w-full">
            <WishlistPagination
              className="mx-auto"
              currentPage={currentPage}
              totalPages={totalPage}
              onChangePage={handleChangePage}
            />
          </div>
        )}
      </div>
    );
  };

  return renderSection1();
};

export default WishlistPage;
