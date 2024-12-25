import { useTranslation } from "@/app/i18n";
import { PATH_PAGE } from "@/contains/paths";
import SideBar, { SideBarItem } from "@/shared/Navigation/SideBar";
import React, { ReactNode } from "react";

const PrivacyAndTermLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { lng: string };
}) => {
  const { t } = await useTranslation(params.lng, ["common"]);

  const SIDEBAR_DATA: SideBarItem[] = [
    {
      name: t("common:privacy"),
      url: PATH_PAGE.privacy,
    },
    {
      name: t("common:term"),
      url: PATH_PAGE.term,
    },
    {
      name: t("common:contacts"),
      url: PATH_PAGE.contact,
    },
  ];

  return (
    <div className={`nc-PrivacyAndTermLayout `}>
      <main className="container mb-24 mt-12 flex flex-col lg:mb-32 lg:flex-row lg:gap-5">
        <SideBar sidebarData={SIDEBAR_DATA} showUserInfo={false} />
        {children}
      </main>
    </div>
  );
};

export default PrivacyAndTermLayout;
