"use client";

import { useTranslation } from "@/app/i18n/client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes } from "react";
import React from "react";

export interface ButtonBackProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: string;
}

const ButtonBack: React.FC<ButtonBackProps> = ({
  className = " ",
  size = "w-5 h-auto",
}) => {
  const router = useRouter();
  const { t } = useTranslation(["addBusiness"]);
  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center gap-3 font-semibold text-neutral-500 hover:underline dark:text-neutral-300 ${className}`}
    >
      <ArrowLeftIcon className={size} />
      <span className="text-neutral-600 dark:text-neutral-400">
        {t("addBusiness:goBack")}
      </span>
    </button>
  );
};

export default ButtonBack;
