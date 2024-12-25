import axios from "axios";

export const sendContactForm = (data: any, reCaptchaToken: string | null) => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };

  return axios.post(`/api/slack-contacts`, data, config);
};
