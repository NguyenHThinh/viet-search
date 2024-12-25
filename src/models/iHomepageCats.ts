import { IBusiness } from "./iBusiness";
import { iCategory, iCountryCode } from "./iFacets";

export interface iCountriesHomePage extends iCountryCode {
  items: IBusiness[];
}

export interface iHomePageData {
  categories: iCategory[];
  countries: iCountriesHomePage[];
  associations: IBusiness[];
  business: IBusiness[];
}
