import { IOpenHours } from "./iOpenHours";

export interface IBusinessCategory {
  id: string;
  names: {
    [key: string]: string;
  };
  level: number;
  parent_id: string;
  types: string[];
}

export interface IBusinessContact {
  type: string;
  value: string;
}

export interface IBusinessRating {
  levels: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
  average: number;
  total: number;
}

export interface IBusinessAddress {
  displayed: string;
  zipcode: string;
  country: string;
  country_names: {
    [key: string]: string;
  };
  locality: string;
  street: string;
  state: string;
}

export interface IBusiness {
  id: string;
  owner: string;
  images: string[];
  types: string[];
  thumbnail: string;
  address: IBusinessAddress;
  business_rank: number;
  title: string;
  name: string;
  description: string;
  descriptions: { [key: string]: string };
  names: {
    [key: string]: string;
  };
  location?: {
    lon: number;
    lat: number;
  };
  categories: IBusinessCategory[];
  contacts: IBusinessContact[];
  status: string;
  overview_rating: IBusinessRating;
  top_listing: [];
  isWishlist: boolean;
  keywords: string[];
  user_id: string;

  open_hours: IOpenHours;

  distance: string;
  slug: string;
}

export interface IAddBusiness {
  types: string[];
  descriptions: string;
  name: string;
  contacts: { type: string; value: string }[];
}
