import { WhereSuggestion } from "@/contexts/suggestionContext";
import { iCategory } from "@/models/iFacets";
import { IBusiness } from "@/models/iBusiness";
import API from "@/utils/api";

export const createBusiness = (
  businessData: any,
  reCaptchaToken: string | null,
) => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };
  return API.post("/users/business", businessData, config);
};

export const deleteBusiness = (
  businessId: string,
  reCaptchaToken: string | null,
) => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };
  return API.delete(`/users/business/${businessId}`, config);
};

export const UpdateBusiness = async (
  businessId: string,
  businessData: any,
  reCaptchaToken: string | null,
) => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };
  return await API.patch<IBusiness>(
    `/users/business/${businessId}`,
    businessData,
    config,
  );
};

export const suggestionCategories = async (q: string, lang: string) =>
  await API.get<iCategory[]>("/categories/suggestions", {
    params: {
      q,
      lang,
      size: 20,
      types: "business",
    },
  });

export const suggestionContries = async (q: string, lang: string) =>
  await API.get<WhereSuggestion[]>("/business/suggestions/where", {
    params: {
      q,
      lang,
      size: 20,
    },
  });

export const getDetailBusiness = (
  slug: string | string[],
  accessToken?: string,
) => {
  const config = accessToken
    ? {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    : {};

  return API.get<IBusiness>(`/business/${slug}`, config);
};

export const getRelatedBusiness = (businessId: string) =>
  API.get<{ items: IBusiness[] }>(`/business/related/${businessId}`, {
    params: {
      radius: 300, //300 km around this business
      size: 10,
      start: 0,
    },
  });

export const searchBusiness = (searchParams: { [key: string]: string }) =>
  API.get<IBusiness[]>("/business/search", {
    params: searchParams,
  });
