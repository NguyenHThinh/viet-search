"use client";

import { useTranslation } from "@/app/i18n/client";
import { PATH_PAGE } from "@/contains/paths";
import { useBusinessDetail } from "@/contexts/businessDetailContext";
import Avatar from "@/shared/Avatar";
import { EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const UserInfomation = () => {
  const { t, i18n } = useTranslation(["common"]);
  const { detailData } = useBusinessDetail();

  if (!detailData)
    return (
      <div className="flex flex-col items-center space-y-6 border-neutral-200 px-0 text-center dark:border-neutral-700 sm:space-y-7 sm:rounded-2xl sm:border sm:p-6 xl:p-8">
        <div className="h-24 w-24 animate-pulse rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
        <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700"></div>
      </div>
    );

  return (
    <div className="flex flex-col items-center space-y-6 border-neutral-200 px-0 text-center dark:border-neutral-700 sm:space-y-7 sm:rounded-2xl sm:border sm:p-6 xl:p-8">
      <Avatar
        // hasChecked
        radius="rounded-full border"
        hasCheckedClass="w-6 h-6 -top-0.5 right-2"
        sizeClass="w-24 h-24"
        imgUrl={detailData?.thumbnail ?? ""}
      />

      {/* ---- */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <h2 className="line-clamp-2 text-lg font-semibold">
          {detailData?.names?.[i18n.language] ||
            detailData?.name ||
            "VietSearch"}
        </h2>
        {/* view business */}
        <div>
          <Link
            href={PATH_PAGE?.business.detail(
              detailData?.slug ?? detailData?.id ?? "",
            )}
            className="flex w-max items-center gap-1 rounded-md border px-3 py-1.5 hover:bg-neutral-100 hover:shadow-sm dark:hover:bg-neutral-800"
          >
            <EyeIcon className="h-5 w-5" />
            <span className="text-sm font-medium">
              {t("common:viewBusiness")}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserInfomation;
