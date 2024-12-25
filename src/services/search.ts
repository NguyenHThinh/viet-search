import API from "@/utils/api";
import { iHomePageData } from "@/models/iHomepageCats";

export const getSuggestionWhat = (searchParams: {
  q: string;
  size: number;
  lang: string;
  claimFilter?: string;
}) =>
  API.get("/business/suggestions", {
    params: searchParams,
  });

export const getFilter = (
  searchParams: { [key: string]: string },
  keyFilter: string,
) =>
  API.get("/business/search", {
    params: { ...searchParams, size: 0, facets: `${keyFilter}:300` },
  });

export const getSuggestionWhere = (searchParams: {
  q: string;
  size: number;
  lang: string;
}) =>
  API.get("/business/suggestions/where", {
    params: searchParams,
  });

export const getHomePage = (params: {
  itemsCountry: number;
  categories: number;
}) =>
  API.get<iHomePageData>("/homepage", {
    params,
  });
