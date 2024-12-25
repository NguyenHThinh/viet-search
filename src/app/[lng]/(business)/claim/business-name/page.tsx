"use client";

import AppImageWithLoading from "@/components/AppImageWithLoading";
import ourFeatures from "@/images/our-features.png";
import { useTranslation } from "@/app/i18n/client";
import InputSuggestBusinessName from "../components/InputSuggestBusinessName";

const SuggestClaim = () => {
  const { t } = useTranslation(["claim"]);

  return (
    <div className="my-14 flex flex-row items-start gap-20 lg:my-20">
      <div className="content flex-1 space-y-8">
        <h1 className="text-3xl font-bold">{t("claim:startClaim")}</h1>
        <h2 className="mr-4">{t("claim:searchYourBusinessName")}</h2>
        <InputSuggestBusinessName />
      </div>
      <div className="hidden lg:block lg:w-[430px]">
        <AppImageWithLoading src={ourFeatures} alt="" />
      </div>
    </div>
  );
};

export default SuggestClaim;
