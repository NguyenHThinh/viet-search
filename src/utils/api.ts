import axios, { AxiosRequestConfig } from "axios";

// config
import { APP_CONFIGS } from "@/config-global";
import { isValidToken } from "@/utils/jwt";
import { PATH_AUTH } from "@/contains/paths";
import { deleteCookie } from "cookies-next";

// ----------------------------------------------------------------------

const API = axios.create({ baseURL: APP_CONFIGS.apiUrl });

API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalConfig = error.config;
    console.log(
      error.response &&
        error.response.status === 401 &&
        !isValidToken(localStorage.getItem(APP_CONFIGS.keyRefreshToken) || ""),
    );
    if (
      error.response &&
      error.response.status === 401 &&
      !isValidToken(localStorage.getItem(APP_CONFIGS.keyRefreshToken) || "")
    ) {
      try {
        const result: { accessToken: string } = await axios.post(
          "/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(APP_CONFIGS.keyRefreshToken)}`,
            },
          },
        );
        // // @ts-ignore
        const { accessToken } = result;
        if (accessToken) {
          localStorage.setItem(APP_CONFIGS.keyToken, accessToken);
          originalConfig.headers.Authorization = `Bearer ${accessToken}`;
          return API(originalConfig);
        } else {
          delete API.defaults.headers.common.Authorization;
          localStorage.removeItem(APP_CONFIGS.keyToken);
          deleteCookie(APP_CONFIGS.keyToken);
          localStorage.removeItem(APP_CONFIGS.keyRefreshToken);
          window.location.href = PATH_AUTH.login;
        }
      } catch (err) {
        console.log(err);
        // @ts-ignore
        delete API.defaults.headers.common.Authorization;
        localStorage.removeItem(APP_CONFIGS.keyToken);
        deleteCookie(APP_CONFIGS.keyToken);
        localStorage.removeItem(APP_CONFIGS.keyRefreshToken);
        window.location.href = PATH_AUTH.login;
        return Promise.reject(
          (error.response && error.response.data) || "Something went wrong",
        );
      }
    }
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong",
    );
  },
);

export default API;
