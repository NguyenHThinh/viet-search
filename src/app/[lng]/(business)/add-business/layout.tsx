import React from "react";
import { FC } from "react";
import AuthGuard from "@/auth/AuthGuard";
import { useTranslation as getTranslation } from "@/app/i18n";

export interface CommonLayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
    lng: string;
  };
}) {
  const { t } = await getTranslation(params.lng, ["common", "homepage"]);

  return {
    title: `${t("common:addYourBusiness")} | VietSearch`,
    description: t("homepage:heroDesc"),
    openGraph: {
      title: `${t("common:addYourBusiness")} | VietSearch`,
      description: t("homepage:heroDesc"),
    },
  };
}

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  return (
    <AuthGuard>
      <div
        className={`nc-PageAddListing1 relative mx-auto max-w-3xl px-4 pb-24 pt-14 sm:py-24 lg:pb-32`}
      >
        <div className="space-y-11">{children}</div>
      </div>
    </AuthGuard>
  );
};

export default CommonLayout;
