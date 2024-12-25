"use client";

import { useTranslation } from "@/app/i18n/client";
import AppImageWithLoading from "@/components/AppImageWithLoading";
import ListingImageGallery from "@/components/listing-image-gallery/ListingImageGallery";
import { IBusiness } from "@/models/iBusiness";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import { FC, useEffect, useState } from "react";

interface HeaderAndGalleryProps {
  detailData: IBusiness | null;
}

const HeaderAndGallery: FC<HeaderAndGalleryProps> = ({ detailData }) => {
  const { t } = useTranslation(["detail"]);
  const [isOpenGallery, setIsOpenGallery] = useState(false);
  const [images, setImages] = useState<string[] | undefined>(undefined);
  const [listImageGallery, setListImageGallery] = useState<
    { id: number; url: string }[] | undefined
  >(undefined);

  useEffect(() => {
    const curListImageGallery =
      detailData?.images.filter((img) => img !== detailData.thumbnail) ?? [];
    setImages(curListImageGallery);
    const newListImageGallery = curListImageGallery
      .filter((url) => !!url) //clear empty value
      .map((url, index) => ({
        id: index,
        url: url,
      }));

    setListImageGallery(newListImageGallery);
  }, [detailData]);

  if (!images?.length) return <></>;

  return (
    <>
      <ListingImageGallery
        isShowModal={isOpenGallery}
        onClose={() => {
          setIsOpenGallery(false);
        }}
        images={listImageGallery}
      />
      {/*  HEADER */}
      <header className="rounded-md sm:rounded-xl">
        <div className="relative grid grid-cols-3 gap-1 sm:gap-2 lg:grid-cols-4">
          <div
            className={`relative ${images?.length === 2 || images?.length === 3 ? "col-span-3 md:col-span-2 lg:col-span-3" : images?.length === 1 ? "col-span-4" : images?.length === 4 ? "col-span-2 row-span-3 !min-h-0 lg:row-span-2" : "col-span-2 !row-span-1 min-h-fit lg:col-span-2 lg:!row-span-2"} aspect-h-3 row-span-2 min-h-[350px] cursor-pointer overflow-hidden rounded-md sm:rounded-xl`}
            onClick={() => {
              setIsOpenGallery(true);
            }}
          >
            <AppImageWithLoading
              fill
              className="rounded-md object-cover sm:rounded-xl"
              src={images?.[0] ?? ""}
              alt=""
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            />
            <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100"></div>
          </div>
          {images?.length &&
            images.slice(1, 5).map((item, index) => (
              <div
                key={index}
                className="relative row-span-1 overflow-hidden rounded-md sm:rounded-xl"
              >
                <div className={`aspect-1 sm:aspect-h-2 sm:aspect-w-3`}>
                  <AppImageWithLoading
                    fill
                    className="rounded-md object-cover sm:rounded-xl "
                    src={item || ""}
                    alt=""
                    sizes="400px"
                  />
                </div>

                {/* OVERLAY */}
                <div
                  className="absolute inset-0 cursor-pointer bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100"
                  onClick={() => {
                    setIsOpenGallery(true);
                  }}
                />
              </div>
            ))}

          <button
            className="absolute bottom-3 left-3 z-10 hidden rounded-xl bg-neutral-100 px-4 py-2 text-neutral-500 hover:bg-neutral-200 md:flex md:items-center md:justify-center"
            onClick={() => {
              setIsOpenGallery(true);
            }}
          >
            <Squares2X2Icon className="h-5 w-5" />
            <span className="ml-2 text-sm font-medium text-neutral-800">
              {t("detail:showAllPhotos")}
            </span>
          </button>
        </div>
      </header>
    </>
  );
};

export default HeaderAndGallery;
