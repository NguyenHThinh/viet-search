"use client";

import AppImageWithLoading from "@/components/AppImageWithLoading";
import ourFeatures from "@/images/our-features.png";
import ButtonBack from "@/shared/ButtonBack";
import { useTranslation } from "@/app/i18n/client";
import { PATH_PAGE } from "@/contains/paths";
import { useEffect, useState } from "react";
import { IBusiness } from "@/models/iBusiness";
import { getDetailBusiness } from "@/services/business";
import { notFound } from "next/navigation";
import FormNewInfoClaim from "../components/FormNewInfoClaim";
import { Trans } from "react-i18next";
import SendVerifyEmail from "../components/SendVerifyCodeEmail";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const SuggestClaim = ({ params: { bid } }: { params: { bid: string } }) => {
  const { t, i18n } = useTranslation(["claim"]);

  const [businessData, setBusinessData] = useState<IBusiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccessManual, setIsSuccessManual] = useState(false);
  const [error, setError] = useState(false);

  //
  const OPTION_CLAIM = {
    existEmail: {
      name: "existEmail",
      title: t("claim:receiveAt"),
      desc: <SendVerifyEmail businessData={businessData} bid={bid} />,
    },
    newInfo: {
      name: "newInfo",
      title: t("claim:submitNewInfo"),
      desc: (
        <FormNewInfoClaim
          businessData={businessData}
          setSuccessManual={setIsSuccessManual}
        />
      ),
    },
  };
  const [optionClaim, setOptionClaim] = useState(OPTION_CLAIM.existEmail.name);

  // fetch business data by id
  const getBusinessData = async (bid: string) => {
    setIsLoading(true);
    try {
      const response = await getDetailBusiness(bid);
      if (response) {
        setBusinessData(response);
        // check has email contact to change default option claim
        const hasEmail = response?.contacts.find(
          (item) => item.type === "email",
        );
        setOptionClaim(
          hasEmail ? OPTION_CLAIM.existEmail.name : OPTION_CLAIM.newInfo.name,
        );
      }
    } catch (error: any) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // refetch business data
  useEffect(() => {
    if (bid) {
      getBusinessData(bid);
    }
  }, [bid]);

  // show error
  if (error) {
    notFound();
  }

  const renderOptionsClaim = () => {
    if (isLoading)
      return (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-gray-200"></div>
        </div>
      );

    // not have email contact
    if (businessData?.contacts.every((item) => item.type !== "email"))
      return (
        <div className="w-full space-y-8 border p-5 shadow-sm md:p-8">
          <label
            htmlFor={OPTION_CLAIM.newInfo.name}
            className="flex flex-row gap-1"
          >
            <div
              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${optionClaim === OPTION_CLAIM.newInfo.name ? "border-blue-500" : "border-neutral-700"}`}
            >
              <span
                className={`aspect-1 w-3 rounded-full bg-blue-400 ${optionClaim === OPTION_CLAIM.newInfo.name ? "block" : "hidden"}`}
              ></span>
            </div>
            <input
              type="radio"
              className="hidden"
              name="selectOptionClaim"
              id={OPTION_CLAIM.newInfo.name}
              onClick={() => setOptionClaim(OPTION_CLAIM.newInfo.name)}
              checked={optionClaim === OPTION_CLAIM.newInfo.name}
            />
            <div className="flex w-full flex-col space-y-8 lg:ml-5">
              <p className="font-medium">{OPTION_CLAIM.newInfo.title}</p>
              {optionClaim === OPTION_CLAIM.newInfo.name &&
                OPTION_CLAIM.newInfo.desc}
            </div>
          </label>
        </div>
      );

    // have email contact
    return Object.values(OPTION_CLAIM).map((item) => (
      <div
        className="w-full rounded-md border p-5 shadow-sm md:p-8"
        key={item.name}
      >
        <label
          htmlFor={item.name}
          className="flex cursor-pointer flex-row gap-2"
        >
          <div
            className={`mt-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border ${optionClaim === item.name ? "border-blue-500" : "border-neutral-700"}`}
          >
            <span
              className={`aspect-1 w-3 rounded-full bg-blue-400 ${optionClaim === item.name ? "block" : "hidden"}`}
            ></span>
          </div>
          <input
            type="radio"
            className="hidden"
            name="selectOptionClaim"
            id={item.name}
            value={item.name}
            onChange={(e) => setOptionClaim(e.target.value)}
            checked={optionClaim === item.name}
          />
          <div className="flex w-full flex-col space-y-8 lg:ml-5">
            <p className="font-medium">{item.title}</p>
            {optionClaim === item.name && item.desc}
          </div>
        </label>
      </div>
    ));
  };

  const renderSuccessClaimManual = () => {
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
        <CheckCircleIcon className="h-20 w-20 text-green-500" />
        <h3 className="text-xl font-semibold lg:text-2xl">
          {t("claim:submitSuccess")}
        </h3>
        <p className="mx-auto w-full text-center text-base text-neutral-700 dark:text-neutral-200 md:w-2/3 md:text-lg lg:w-2/3">
          {t("claim:reviewAndNotifyLater")}
        </p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-row items-center gap-20">
      <div className="content flex-1 space-y-8 py-10">
        {!isSuccessManual && (
          <>
            <ButtonBack className="text-neutral-100" />
            <h1 className="text-3xl font-bold">
              {t("claim:chooseOptionClaim")}
            </h1>
            <h2 className="mr-4">
              <Trans i18nKey="claim:byContinue">
                <a
                  target="_blank"
                  href={PATH_PAGE.term}
                  className="text-primary-400 hover:underline"
                ></a>
                <a
                  target="_blank"
                  href={PATH_PAGE.privacy}
                  className="text-primary-400 hover:underline"
                ></a>
              </Trans>
              {t("claim:youAboutToClaim")}
              <span className="font-semibold">
                {businessData?.names?.[i18n.language] || businessData?.name}
              </span>
            </h2>
          </>
        )}
        {isSuccessManual ? renderSuccessClaimManual() : renderOptionsClaim()}
      </div>
      <div className="hidden lg:block lg:w-2/5">
        <AppImageWithLoading src={ourFeatures} alt="" />
      </div>
    </div>
  );
};

export default SuggestClaim;
