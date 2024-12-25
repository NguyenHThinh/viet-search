import type { FC } from "react";
import React, { useEffect, useState } from "react";

import Avatar from "@/shared/Avatar";
import { Comment } from "@/models/iCommentAndReview";
import ShowRatingStar from "./ShowRatingStar";
import ListingImageGallery from "./listing-image-gallery/ListingImageGallery";
import { useAuthContext } from "@/auth/useAuthContext";
import { Menu } from "@headlessui/react";
import {
  TrashIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "@/app/i18n/client";
import AppImageWithLoading from "./AppImageWithLoading";
import { useWindowSize } from "react-use";

export interface CommentImageListingDashboardProps {
  className?: string;
  data: Comment;
  lang: string;
  onDelete?: (businessId: string, reviewId: string) => void;
  onUpdate?: (data: Comment) => void;
}

const CommentImageListingDashboard: FC<CommentImageListingDashboardProps> = ({
  className = "",
  data,
  lang,
  onDelete,
  onUpdate,
}) => {
  const { t } = useTranslation(["common", "detail"]);
  const { user } = useAuthContext();
  const [listImageGallery, setListImageGallery] = useState<
    { id: number; url: string }[] | undefined
  >(undefined);
  const [isOpenGallery, setIsOpenGallery] = useState(false);

  const windowWidth = useWindowSize().width;
  const [maxItems, setMaxItems] = useState(5);

  // refactor images to listImageGallery
  useEffect(() => {
    const newListImageGallery = data?.images.map((url, index) => ({
      id: index,
      url: url ?? "",
    }));
    setListImageGallery(newListImageGallery);
  }, [data?.images]);

  // refactor Date
  const handleShowDate = (dateString: string) => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString(lang, options);
  };

  useEffect(() => {
    if (windowWidth < 500) {
      return setMaxItems(2);
    }
    if (windowWidth < 768) {
      return setMaxItems(3);
    }
    if (windowWidth < 1024) {
      return setMaxItems(4);
    }
    if (windowWidth < 1280) {
      return setMaxItems(3);
    }
    setMaxItems(5);
  }, [windowWidth]);

  return (
    <div
      className={`nc-CommentListing flex space-x-4 py-4 ${className}`}
      data-nc-id="CommentListing"
    >
      <ListingImageGallery
        isShowModal={isOpenGallery}
        onClose={() => setIsOpenGallery(false)}
        images={listImageGallery}
      />
      <div className="cursor-default pt-0.5">
        <Avatar
          sizeClass="h-10 w-10 text-lg"
          radius="rounded-full"
          userName={data?.user?.name ?? data?.user?.email ?? ""}
          imgUrl={data?.user?.avatar ?? ""}
        />
      </div>
      <div className="grow">
        <div className="flex justify-between space-x-3">
          <div className="flex flex-col">
            <div className="text-sm font-semibold">
              <span>{data?.user?.name ?? data?.user?.email ?? ""}</span>
            </div>
            <span className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              {handleShowDate(data.updatedAt ?? data.createdAt)}
            </span>
            {data?.rating && user?.email === data?.user?.email && (
              <ShowRatingStar rating={data?.rating} />
            )}
          </div>
          {data?.rating && user?.email !== data?.user?.email && (
            <ShowRatingStar rating={data?.rating} />
          )}
          {user?.email === data?.user?.email && (
            <Menu as="div" className="relative">
              <Menu.Button className="h-8 w-8 rounded-full bg-gray-100 p-1 text-sm font-semibold text-gray-800 hover:bg-gray-200 focus:outline-none">
                <EllipsisHorizontalIcon />
              </Menu.Button>

              <Menu.Items className="absolute right-0 top-8 z-10 mt-2 w-max rounded-xl border border-neutral-300 bg-neutral-50 p-1 text-left text-sm text-gray-800 transition duration-100 ease-out focus:outline-none">
                <Menu.Item>
                  <button
                    onClick={() =>
                      onDelete && onDelete(data?.business?._id, data?._id)
                    }
                    className={`group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-neutral-100`}
                  >
                    <TrashIcon className="h-4 w-4" />
                    {t("common:delete")}
                  </button>
                </Menu.Item>
                {onUpdate && (
                  <Menu.Item>
                    <button
                      onClick={() => onUpdate(data)}
                      className={`group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-neutral-100`}
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      {t("common:update")}
                    </button>
                  </Menu.Item>
                )}
              </Menu.Items>
            </Menu>
          )}
        </div>
        <span className="mt-3 block text-neutral-6000 dark:text-neutral-300">
          {data?.comment ?? ""}
        </span>
        <div className="mt-3 flex flex-row items-center gap-2">
          {data?.images &&
            data?.images.slice(0, maxItems)?.map((image, index) => (
              <div className="relative h-32 w-32" key={index}>
                <AppImageWithLoading
                  src={image}
                  alt={image}
                  fill
                  className="cursor-pointer rounded-lg object-cover"
                  onClick={() => setIsOpenGallery(true)}
                />
                {index === maxItems - 1 && data?.images?.length > maxItems && (
                  <div
                    className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black bg-opacity-50 text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpenGallery(true);
                    }}
                  >
                    +{data?.images?.length - maxItems + 1}
                  </div>
                )}
              </div>
            ))}
        </div>
        {data?.images?.length > maxItems && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpenGallery(true);
            }}
            className="mt-2 underline hover:no-underline dark:text-neutral-200"
          >
            {t("detail:seeAllImages")}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentImageListingDashboard;
