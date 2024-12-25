"use client";

import { PATH_USER_DASHBOARD } from "@/contains/paths";
import CommonPagination from "@/shared/CommonPagination";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUpdatedImages } from "@/services/dashboard";
import { Photos } from "@/models/iPhotos";
import AppImageWithLoading from "@/components/AppImageWithLoading";
import ListingImage from "@/components/listing-image-gallery/ListingImage";

export interface PhotosDashboardPageProps {}

const PhotosDashboardPage: FC<PhotosDashboardPageProps> = ({}) => {
  const { t } = useTranslation(["dashBoard", "detail"]);
  //
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams.toString());

  //
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [total, setTotal] = useState({ totalPages: 1, totalResults: 0 });

  //
  const [photos, setPhotos] = useState<Photos[]>([]);

  const [isOpenGallery, setIsOpenGallery] = useState(false);
  const [listImageGallery, setListImageGallery] = useState<
    { id: number; url: string }[] | undefined
  >(undefined);

  useEffect(() => {
    const curListImageGallery = photos ?? [];
    const newListImageGallery = curListImageGallery
      .filter((items) => !!items.url) //clear empty value url
      .map((items, index) => ({
        id: index,
        url: items.url,
      }));

    setListImageGallery(newListImageGallery);
  }, [photos]);

  //
  const handleGetUploadedPhotos = async (page: number) => {
    const data = await getUpdatedImages(page);
    setTotal({
      totalPages: data?.totalPages ?? 1,
      totalResults: data.totalResults ?? 0,
    });
    return data?.results;
  };

  //
  const { data, isLoading } = useQuery<Photos[]>({
    queryKey: ["usersPhotos", currentPage],
    queryFn: () => handleGetUploadedPhotos(currentPage),
  });

  //
  useEffect(() => {
    data && setPhotos(data);
  }, [data]);

  //
  const handleChangePage = (newPage: number) => {
    window.scrollTo(0, 0);
    setPhotos([]);
    setCurrentPage(newPage);
    if (newPage === 1) {
      router.push(PATH_USER_DASHBOARD.accountPhotos);
      return;
    }
    router.push(`?page=${newPage}`);
  };

  const handleSelectImage = (photoId: number) => {
    setIsOpenGallery(true);
    router.push(`?${currentParams.toString()}&photoId=${photoId}`);
  };

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="w-full rounded-md">
          <div className="grid animate-pulse grid-cols-4 space-x-4">
            {Array(12)
              .fill(0)
              .map((_, index) => {
                return <div key={index} className="aspect-1 w-full"></div>;
              })}
          </div>
        </div>
      );

    if (photos.length === 0)
      return (
        <div className="w-full text-center">
          <span className="text-xl font-medium ">
            {t("dashBoard:notFoundPhotos")}
          </span>
        </div>
      );

    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((item, index) => (
          <div key={index} className="aspect-1 w-full">
            <AppImageWithLoading
              fill
              src={item.url}
              alt=""
              className="cursor-pointer rounded-md object-cover"
              onClick={() => handleSelectImage(index)}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderSection = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">{`${t("dashBoard:photos")} ${total.totalResults ? `(${total.totalResults} ${t("dashBoard:photos")})` : ""}`}</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* comment */}
        <div className="">
          {renderContent()}
          <div className="mt-5 flex justify-center">
            <CommonPagination
              paging={{ currentPage, totalPages: total.totalPages }}
              onChangePage={handleChangePage}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full shrink-0">
      <ListingImage
        isShowModal={isOpenGallery}
        onClose={() => {
          setIsOpenGallery(false);
        }}
        images={listImageGallery}
      />
      {renderSection()}
    </div>
  );
};

export default PhotosDashboardPage;
