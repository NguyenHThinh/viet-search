"use client";

import BackgroundSection from "@/components/BackgroundSection";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import React, { ReactNode, Suspense } from "react";
import MobileFooterSticky from "./(components)/MobileFooterSticky";
import ShowAllGallery from "./ShowAllGallery";

const DetailtLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="ListingDetailPage">
      <Suspense>
        <ShowAllGallery />
      </Suspense>

      <div className="ListingDetailPage__content container">{children}</div>

      {/* OTHER SECTION */}
      <div className="container py-24 lg:py-32">
        <div className="relative py-16">
          <BackgroundSection />
          <SectionSliderNewCategories
            heading="Explore by types of stays"
            subHeading="Explore houses based on 10 types of stays"
            categoryCardType="card5"
            itemPerRow={5}
            sliderStyle="style2"
          />
        </div>
        <SectionSubscribe2 className="pt-24 lg:pt-32" />
      </div>

      {/* STICKY FOOTER MOBILE */}
      <MobileFooterSticky />
    </div>
  );
};

export default DetailtLayout;
