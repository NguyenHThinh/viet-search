"use client";

import { useTranslation } from "@/app/i18n/client";
import BusinessCardEdit from "@/components/BusinessCardEdit";
import ConfirmModal from "@/components/ConfirmDeleteModal";
import {
  PATH_BUSINESS_DASHBOARD,
  PATH_CLAIM,
  PATH_PAGE,
} from "@/contains/paths";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useToast } from "@/hooks/useToast";
import { IBusiness } from "@/models/iBusiness";
import { deleteBusiness } from "@/services/business";
import { getCreatedBusiness } from "@/services/dashboard";
import ButtonPrimary from "@/shared/ButtonPrimary";
import CommonPagination from "@/shared/CommonPagination";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useCallback, useEffect, useState } from "react";

export interface BusinessDashboardPageProps {}

const BusinessDashboardPage: FC<BusinessDashboardPageProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashBoard", "common"]);
  const { showToast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();
  //
  const router = useRouter();
  const searchParams = useSearchParams();

  //
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT_RESULTS = 10;

  //
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  //
  const [createdBusiness, setCreatedBusiness] = useState<IBusiness[]>([]);

  //
  const handleGetCreatedBusiness = async (page: number, limit: number) => {
    const data = await getCreatedBusiness(page, limit);
    const countPage = Math.ceil(data?.total?.value / limit);
    setTotalPages(countPage);
    return data?.items;
  };

  //
  const { data, refetch, isLoading } = useQuery<IBusiness[]>({
    queryKey: ["createdBusiness", currentPage],
    queryFn: () => handleGetCreatedBusiness(currentPage, LIMIT_RESULTS),
  });

  //
  useEffect(() => {
    if (data) {
      setCreatedBusiness(data);
      if (data.length === 0 && currentPage > 1) {
        handleChangePage(currentPage - 1);
      }
    }
  }, [data]);

  //
  const handleChangePage = (newPage: number) => {
    window.scrollTo(0, 0);
    setCreatedBusiness([]);
    setCurrentPage(newPage);
    if (newPage === 1) {
      router.push(PATH_BUSINESS_DASHBOARD.createdBusiness);
      return;
    }
    router.push(`?page=${newPage}`);
  };

  //
  const onCloseConfirmModal = () => {
    setIsOpenConfirmModal(false);
  };

  const onDeleteConfirm = async () => {
    const recaptchaToken = await getRecaptchaToken();
    setIsDeleting(true);
    try {
      await deleteBusiness(deleteId, recaptchaToken);
      setCreatedBusiness((prev) => prev.filter((i) => i.id !== deleteId));
      showToast("success", t("dashBoard:deleteSuccess"));
    } catch (err) {
      console.error("Failed to delete business:", err);
      showToast(
        "error",
        <a
          href={PATH_PAGE.contact}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >{`${t("dashBoard:deleteFail")}`}</a>,
        5000,
      );
    } finally {
      setIsDeleting(false);
      setIsOpenConfirmModal(false);
    }
  };

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
          {Array.from({ length: 2 }).map((_, index) => (
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

    if (createdBusiness.length === 0) {
      return (
        <div className="text-center">
          <p className="text-neutral-6000 dark:text-neutral-300">
            {t("dashBoard:notFoundBusiness")}
          </p>
          <p className="text-neutral-6000 dark:text-neutral-300">
            {t("dashBoard:createYourBusiness")}{" "}
            <a
              href={PATH_CLAIM.searchClaim}
              className="font-semibold text-neutral-800 underline hover:no-underline"
            >
              {t("dashBoard:rightHere")}
            </a>
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7">
          {createdBusiness.map((item) => (
            <div key={item.id}>
              <BusinessCardEdit
                key={item.id}
                data={item}
                lng={i18n.language}
                t={t}
                onDeleteBusiness={() => {
                  setDeleteId(item.id);
                  setIsOpenConfirmModal(true);
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-center">
          <CommonPagination
            paging={{ currentPage, totalPages }}
            onChangePage={handleChangePage}
          />
        </div>
      </div>
    );
  };

  const renderCreatedBusiness = () => {
    return (
      <div className="listingSection__wrap">
        <div className="flex flex-col justify-between md:flex-row">
          <div>
            <h2 className="text-2xl font-semibold">
              {t("dashBoard:createdBusiness")}
            </h2>
            <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
              {t("dashBoard:showAllCreatedBusiness")}
            </span>
          </div>
          <div className="mt-4 md:mt-0">
            <ButtonPrimary href={PATH_CLAIM.searchClaim}>
              {t("dashBoard:btnCreateYourBusiness")}
            </ButtonPrimary>
          </div>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {renderContent()}
      </div>
    );
  };

  return (
    <div className="w-full shrink-0 grow space-y-8 lg:w-2/3 lg:space-y-10 xl:w-3/4">
      <ConfirmModal
        isLoading={isDeleting}
        isShowModal={isOpenConfirmModal}
        onCancel={onCloseConfirmModal}
        onConfirm={onDeleteConfirm}
      />
      {renderCreatedBusiness()}
    </div>
  );
};

export default BusinessDashboardPage;
