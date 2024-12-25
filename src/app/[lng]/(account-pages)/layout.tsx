import React, { FC } from "react";
import { Nav } from "./(components)/Nav";
import AuthGuard from "@/auth/AuthGuard";
import SideBar, { SideBarItem } from "@/shared/Navigation/SideBar";
import { PATH_USER_DASHBOARD } from "@/contains/paths";
import {
  IconHeart,
  IconImage,
  IconLock,
  IconReview,
  IconUser,
} from "@/shared/Navigation/IconsNavbar";
import { useTranslation as getTranslation } from "@/app/i18n";

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
    lng: string;
  };
}) {
  const { t } = await getTranslation(params.lng, ["dashBoard", "homepage"]);

  return {
    title: `${t("dashBoard:account")} | VietSearch`,
    description: t("homepage:heroDesc"),
    openGraph: {
      title: `${t("dashBoard:account")} | VietSearch`,
      description: t("homepage:heroDesc"),
    },
  };
}

const CommonLayout = async ({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) => {
  const { t } = await getTranslation(lng, "dashBoard");
  const SIDEBAR_DATA: SideBarItem[] = [
    {
      name: t("dashBoard:account"),
      url: PATH_USER_DASHBOARD.account,
      icon: IconUser(),
    },
    {
      name: t("dashBoard:wishlist"),
      url: PATH_USER_DASHBOARD.accountWishlist,
      icon: IconHeart(),
    },
    {
      name: t("dashBoard:reviews"),
      url: PATH_USER_DASHBOARD.accountReviews,
      icon: IconReview(),
    },
    {
      name: t("dashBoard:photos"),
      url: PATH_USER_DASHBOARD.accountPhotos,
      icon: IconImage(),
    },
    {
      name: t("dashBoard:password"),
      url: PATH_USER_DASHBOARD.accountPassword,
      icon: IconLock(),
    },
  ];

  return (
    <AuthGuard>
      {/* <div className="nc-CommonLayoutAccount bg-neutral-50 dark:bg-neutral-900">
        <div className="border-b border-neutral-200 bg-white pt-12 dark:border-neutral-700 dark:bg-neutral-800">
          <Nav />
        </div>
        <div className="container pb-24 pt-14 sm:pt-20 lg:pb-32">
          {children}
        </div>
      </div> */}
      <div className="nc-CommonLayoutAccount">
        <main className="container mb-24 flex flex-col gap-5 lg:mb-32 lg:mt-10 lg:flex-row">
          <SideBar sidebarData={SIDEBAR_DATA} />
          <div className="listingSection__wrap grow">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default CommonLayout;
