import { SuggestEditFormType } from "@/app/[lng]/(business)/claim/components/FormSuggestEdit";
import API from "@/utils/api";

export const claimManual = (
  businessId: string,
  data: any,
  reCaptchaToken: string | null,
) => {
  return API.post(`/business/${businessId}/claims?claimMethod=manual`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "g-recaptcha-response": reCaptchaToken,
    },
  });
};

export const claimWithEmail = (
  businessId: string,
  businessEmail: string,
  reCaptchaToken: string | null,
) => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };

  return API.post(
    `/business/${businessId}/claims?claimMethod=email`,
    {
      businessEmail,
    },
    config,
  );
};

export const verifyClaimCode = (
  businessId: string,
  businessEmail: string,
  otp: string,
  reCaptchaToken: string | null,
) => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };

  return API.post(
    `/business/${businessId}/claims/verify-otp?claimMethod=email`,
    {
      businessEmail,
      otp,
    },
    config,
  );
};

export const resendVerifyClaimCode = (
  businessId: string,
  businessEmail: string,
  lang: string,
  reCaptchaToken: string | null,
) => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };

  return API.post(
    `/business/${businessId}/claims/resend-otp`,
    {
      businessEmail,
      lang,
    },
    config,
  );
};

export const customerSuggestEdit = (
  businessId: string,
  data: SuggestEditFormType,
  reCaptchaToken: string | null,
) => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };

  return API.post(`/business/${businessId}/edit-suggestions`, data, config);
};
