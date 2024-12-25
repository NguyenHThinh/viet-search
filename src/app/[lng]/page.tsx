import React, { cache } from "react";

import SectionHero from "@/app/[lng]/(server-components)/SectionHero";
import BackgroundSection from "@/components/BackgroundSection";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import HomeBecomeAnAuthor from "@/components/HomeBecomeAnAuthor";
import SectionClientSay from "@/components/SectionClientSay";
import HomeGridAuthorBox from "@/components/HomeGridAuthorBox";
import SectionGridCategoryBox from "@/components/SectionGridCategoryBox";
import HomeHowItWork from "@/components/HomeHowItWork";
import HomeSectionOurFeatures from "@/components/HomeSectionOurFeatures";
import HomeSubscribe2 from "@/components/HomeSubscribe2";
import HomeSectionVideos from "@/components/HomeSectionVideos";

import { languages, fallbackLng } from "@/app/i18n/config-lang";
import API from "@/utils/api";
import { iHomePageData } from "@/models/iHomepageCats";
import SliderHomePageCategories from "@/components/SliderHomePageCategories";
import HomeGridFeaturePlaces from "@/components/HomeGridFeaturePlaces";
import HomeDowloadApp from "./(home)/HomeDowloadApp";
import { useTranslation } from "../i18n";
import { PAGE_REVALIDATE } from "@/constants/revalidating";
import { getHomePage } from "@/services/search";
import HomeGoogleLogin from "@/app/[lng]/(client-components)/HomeGoogleLogin";

const getData = cache(
  async () => await getHomePage({ itemsCountry: 8, categories: 20 }),
);

// @ts-ignore
export const revalidate = 3600; // revalidate at most every hour

async function PageHome({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = await useTranslation(lng, "homepage");
  if (languages.indexOf(lng) < 0) lng = fallbackLng;
  const homePageData = await getData();

  return (
    <main className="nc-PageHome relative overflow-hidden">
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <div className="container relative mb-24 space-y-24 lg:mb-28 lg:space-y-28">
        {/* SECTION HERO */}
        <SectionHero className="pt-10 lg:py-16" t={t} />
        {/* SECTION SUGGESTION COUNTRIES */}
        <SliderHomePageCategories
          categories={homePageData?.categories}
          heading={t("catsSuggestion")}
          categoryCardType="card5"
          itemPerRow={5}
        />

        <HomeSectionOurFeatures t={t} />

        <SliderHomePageCategories
          categories={homePageData?.business}
          heading={t("suggestBusiness") ?? ""}
          // subHeading={t("populaPlace") ?? ""}
        />

        {/* FEATURE WITH PLACES GIRD TYPE */}
        <div className="relative py-16">
          <BackgroundSection />
          <HomeGridFeaturePlaces
            heading={t("featuredPlaces")}
            subHeading={t("populaPlace")}
            cardType="card2"
            featureListings={homePageData?.countries}
          />
        </div>

        {/*<HomeHowItWork t={t} />*/}

        <div className="relative py-16">
          <BackgroundSection className="bg-orange-50 dark:bg-black/20" />
          <SliderHomePageCategories
            categories={homePageData?.associations}
            categoryCardType="card4"
            itemPerRow={4}
            heading={t("joinGroup")}
            subHeading={t("Over1000")}
            sliderStyle="style2"
          />
        </div>

        {/*<HomeSubscribe2 t={t} />*/}

        {/*<div className="relative py-16">*/}
        {/*  <BackgroundSection className="bg-orange-50 dark:bg-black dark:bg-opacity-20 " />*/}
        {/*  <HomeGridAuthorBox t={t} />*/}
        {/*</div>*/}

        {/*<SectionGridCategoryBox*/}
        {/*  heading={t("exploreNearby")}*/}
        {/*  subHeading={t("discoverPlacesNearYou")}*/}
        {/*/>*/}

        {/*<div className="relative py-16">*/}
        {/*  <BackgroundSection />*/}
        {/*  <HomeBecomeAnAuthor t={t} />*/}
        {/*</div>*/}

        <HomeSectionVideos />

        {/*<div className="relative py-16">*/}
        {/*  <BackgroundSection />*/}
        {/*  <SectionClientSay />*/}
        {/*</div>*/}

        <HomeDowloadApp t={t} />

        <HomeGoogleLogin />
      </div>
    </main>
  );
}

export default PageHome;
