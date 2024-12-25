export interface iCountryCode {
  id: string;
  key: string;
  doc_count: number;
  names: {
    [key: string]: string;
  };
  value: string;
  name: string;
}

export interface iCategory {
  id: string;
  key: string;
  doc_count: number;
  names: {
    [key: string]: string;
  };
  value: string;
  name: string;
}

export interface iTypes {
  id: string;
  key: string;
  doc_count: number;
  names: {
    [key: string]: string;
  };
  value: string;
  name: string;
}

export interface iFacets {
  countries: iCountryCode[];
  categories: iCategory[];
  types: iTypes[];
}
