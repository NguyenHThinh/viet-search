"use client";

import AppImageWithLoading from "@/components/AppImageWithLoading";
import ourFeatures from "@/images/our-features.png";
import ButtonBack from "@/shared/ButtonBack";
import { CheckIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { PATH_CLAIM } from "@/contains/paths";
import Link from "next/link";
import { useTranslation } from "@/app/i18n/client";
import { useSearchParams } from "next/navigation";

const SuggestClaim = () => {
  const { t } = useTranslation(["businessPage", "claim"]);
  const DEMO_DATA = [
    {
      id: 1,
      title: t("businessPage:free"),
      desc: t("businessPage:createNoCost"),
    },
    {
      id: 2,
      title: t("businessPage:easy"),
      desc: t("businessPage:manageBusinessEasy"),
    },
    {
      id: 3,
      title: t("businessPage:personalized"),
      desc: t("businessPage:addMoreInfo"),
    },
  ];

  const searchParams = useSearchParams();
  const businessId = searchParams.get("bid");

  return (
    <div className="my-12 flex flex-row items-center gap-20 lg:my-20">
      <div className="content flex-1 space-y-8">
        <ButtonBack className="text-neutral-100" />
        <h1 className="text-3xl font-bold">{t("claim:claimThisBusiness")}</h1>
        <AppImageWithLoading
          src={ourFeatures}
          alt=""
          width={430}
          className="mx-auto lg:hidden"
        />
        <h2 className="mr-4">{t("claim:joinWithUs")}</h2>
        <ul className="w-4/5 space-y-5">
          {DEMO_DATA.map((item) => (
            <li className="flex flex-row" key={item.id}>
              <CheckIcon className="mr-3 h-5 w-5 min-w-max translate-y-1 text-primary-700" />
              <h3 className="text-base font-semibold text-neutral-600 dark:text-neutral-100 lg:text-lg">
                {/* {t("businessPage:prominentDisplay")} */}
                {item.title}: <span className="font-normal">{item.desc}</span>
              </h3>
            </li>
          ))}
        </ul>
        <div className="space-y-2 text-primary-800">
          <ButtonPrimary href={PATH_CLAIM.claimVerify(businessId || "")}>
            {t("claim:claimForFree")}
          </ButtonPrimary>
          <div>
            <Link
              href={PATH_CLAIM.suggestEdit(businessId || "")}
              className="text-sm font-medium hover:underline"
            >
              {t("claim:continueWithLimited")}
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:w-[430px]">
        <AppImageWithLoading src={ourFeatures} alt="" />
      </div>
    </div>
  );
};

export default SuggestClaim;
