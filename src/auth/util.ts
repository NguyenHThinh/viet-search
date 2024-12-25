import { setCookie, deleteCookie, hasCookie, getCookie } from "cookies-next";
// routes
import { APP_CONFIGS } from "@/config-global";
import { PATH_AUTH, PATH_PAGE } from "@/contains/paths";
// utils
// eslint-disable-next-line import/no-cycle
import API from "../utils/api";
import { COOKIE_NAMES } from "@/constants";
import router from "next/router";

export const tokenExpired = (exp: any) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert("Token expired");

    localStorage.removeItem("accessToken");

    window.location.href = PATH_AUTH.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (
  accessToken?: string | null,
  refreshToken?: string | null,
) => {
  if (accessToken) {
    localStorage.setItem(APP_CONFIGS.keyToken, accessToken);
    API.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    setCookie(APP_CONFIGS.keyToken, accessToken);
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem(APP_CONFIGS.keyToken);
    localStorage.removeItem(APP_CONFIGS.keyRefreshToken);
    deleteCookie(APP_CONFIGS.keyToken);
    delete API.defaults.headers.common.Authorization;
  }

  if (refreshToken) {
    localStorage.setItem(APP_CONFIGS.keyRefreshToken, refreshToken);
  }
};

export const handleCallbackUrlMiddlewareServerComponent = () => {
  // if (hasCookie(COOKIE_NAMES.callbackUrl)) {
  //   const url = getCookie(COOKIE_NAMES.callbackUrl);
  //   router.replace(url || PATH_PAGE.root);
  // }
};
