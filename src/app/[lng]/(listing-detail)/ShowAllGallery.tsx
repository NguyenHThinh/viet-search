"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { imageGallery as listingStayImageGallery } from "./listing-stay-detail/constant";
import { imageGallery as listingCarImageGallery } from "./listing-car-detail/constant";
import { imageGallery as listingExperienceImageGallery } from "./listing-experiences-detail/constant";
import ListingImageGallery from "@/components/listing-image-gallery/ListingImageGallery";
import { Route } from "next";

const ShowAllGallery = () => {
  const router = useRouter();
  const thisPathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams?.get("modal");

  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");
    router.push(`${thisPathname}/?${params.toString()}` as Route);
  };

  const getImageGalleryListing = () => {
    if (thisPathname?.includes("/listing-stay-detail")) {
      return listingStayImageGallery;
    }
    if (thisPathname?.includes("/listing-car-detail")) {
      return listingCarImageGallery;
    }
    if (thisPathname?.includes("/listing-experiences-detail")) {
      return listingExperienceImageGallery;
    }

    return [];
  };

  return (
    <ListingImageGallery
      isShowModal={modal === "PHOTO_TOUR_SCROLLABLE"}
      onClose={handleCloseModalImageGallery}
      images={getImageGalleryListing()}
    />
  );
};

export default ShowAllGallery;
