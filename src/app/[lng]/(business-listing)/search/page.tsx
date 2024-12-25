"use client";

import React, { FC, useEffect } from "react";
import SectionGridHasMap from "../SectionGridHasMap";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";

export interface SearchMapPageProps {}

const SearchMapPage: FC<SearchMapPageProps> = ({}) => {
  const { getSearchParams, clearSearchParams } = useBusinessSearchContext();

  useEffect(() => {
    getSearchParams();
    return () => {
      clearSearchParams();
    };
  }, [clearSearchParams, getSearchParams]);

  return (
    <div className="container pb-24 lg:pb-28 xl:max-w-none xl:pr-0 2xl:pl-10">
      <SectionGridHasMap />
    </div>
  );
};

export default SearchMapPage;
