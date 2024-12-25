import BackgroundSection from "@/components/BackgroundSection";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import SectionGridAuthorBox from "@/components/SectionGridAuthorBox";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import React, { ReactNode } from "react";
import SectionHeroArchivePage from "../(server-components)/SectionHeroArchivePage";
import { useTranslation as getTranslation } from "@/app/i18n";

interface layoutProps {
  children: ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
    lng: string;
  };
}) {
  const { t } = await getTranslation(params.lng, ["homepage"]);

  return {
    title: `${t("homepage:heroTitle")} | VietSearch`,
    description: t("homepage:heroDesc"),
    openGraph: {
      title: `${t("homepage:heroTitle")} | VietSearch`,
      description: t("homepage:heroDesc"),
    },
  };
}

const Layout = ({ children }: layoutProps) => {
  return (
    <div className={`nc-ListingStayPage relative `}>
      <BgGlassmorphism />

      {/* SECTION HERO */}
      <div className="container hidden pb-20 pt-8 lg:block">
        <SectionHeroArchivePage currentPage="Stays" currentTab="Stays" />
      </div>

      {children}

      <div className="container overflow-hidden">
        {/* SECTION 1 */}
        {/*<div className="relative py-16">*/}
        {/*  <BackgroundSection />*/}
        {/*  <SectionSliderNewCategories*/}
        {/*    heading="Explore by types of stays"*/}
        {/*    subHeading="Explore houses based on 10 types of stays"*/}
        {/*    categoryCardType="card5"*/}
        {/*    itemPerRow={5}*/}
        {/*    sliderStyle="style2"*/}
        {/*  />*/}
        {/*</div>*/}

        {/* SECTION */}
        {/*<SectionSubscribe2 className="py-24 lg:py-28" />*/}

        {/* SECTION */}
        {/*<div className="relative mb-24 py-16 lg:mb-28">*/}
        {/*  <BackgroundSection className="bg-orange-50 dark:bg-black dark:bg-opacity-20" />*/}
        {/*  <SectionGridAuthorBox />*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default Layout;
