import { PATH_BUSINESS_DASHBOARD } from "@/contains/paths";
import { IconBuilding } from "@/shared/Navigation/IconsNavbar";
import SideBar, { SideBarItem } from "@/shared/Navigation/SideBar";
import React, { ReactNode } from "react";

import { useTranslation as getTranslation } from "@/app/i18n";

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
    lng: string;
  };
}) {
  const { t } = await getTranslation(params.lng, ["footer", "homepage"]);

  return {
    title: `${t("footer:businessDashboard")} | VietSearch`,
    description: t("homepage:heroDesc"),
    openGraph: {
      title: `${t("footer:businessDashboard")} | VietSearch`,
      description: t("homepage:heroDesc"),
    },
  };
}

const DashBoardLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: {
    lng: string;
  };
}) => {
  const { t } = await getTranslation(params.lng, ["dashBoard", "common"]);

  const SIDEBAR_DATA: SideBarItem[] = [
    {
      name: t("dashBoard:myBusiness"),
      url: PATH_BUSINESS_DASHBOARD.createdBusiness,
      icon: IconBuilding(),
    },
  ];

  return (
    <div className={`nc-DashBoardLayout `}>
      <main className="container mb-24 flex flex-col gap-5 lg:mb-32 lg:mt-10 lg:flex-row">
        <SideBar sidebarData={SIDEBAR_DATA} />
        {children}
      </main>
    </div>
  );
};

export default DashBoardLayout;
