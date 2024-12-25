import API from "@/utils/api";

export interface RegisterResponse {
  email: string;
}

export const userLogin = (
  email: string,
  password: string,
  reCaptchaToken: string | null,
): any => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };

  return API.post(
    "/auth/login",
    {
      email,
      password,
    },
    config,
  );
};

export const userRegister = (
  email: string,
  password: string,
  name: string,
  lang: string,
  reCaptchaToken: string | null,
): Promise<RegisterResponse> => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };

  return API.post(
    "/auth/register",
    {
      name,
      email,
      password,
      lang,
    },
    config,
  );
};

export const verifyEmail = async (token: string) => {
  await API.get(`/auth/verify/${token}`);
};

export const sendVerifyEmail = async (
  email: string,
  lang: string,
  reCaptchaToken: string | null,
) => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };

  return await API.post(
    "/auth/send-verify-email",
    {
      email,
      lang,
    },
    config,
  );
};

export const userLoginGoogle = (token: string): any =>
  API.post("/auth/login/google", { token });

export const sendResetPasswordEmail = async (
  email: string,
  lang: string,
  reCaptchaToken: string | null,
) => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };

  return await API.post(
    "/auth/send-reset-password-email",
    {
      email,
      lang,
    },
    config,
  );
};

export const resetPasswordWithToken = async (
  token: string,
  password: string,
  reCaptchaToken: string | null,
) => {
  const config = {
    headers: {
      "g-recaptcha-response": reCaptchaToken,
    },
  };

  return await API.post(
    "/auth/reset-password",
    {
      token,
      password,
    },
    config,
  );
};
