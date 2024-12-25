import React, { FC } from "react";
import SectionGridHasMap from "../SectionGridHasMap";

export interface ListingStayMapPageProps {}

const ListingStayMapPage: FC<ListingStayMapPageProps> = ({}) => {
  return (
    <div className="container pb-24 lg:pb-28 xl:max-w-none xl:pr-0 2xl:pl-10">
      <SectionGridHasMap />
    </div>
  );
};

export default ListingStayMapPage;
