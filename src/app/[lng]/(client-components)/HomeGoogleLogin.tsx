"use client";
import React from "react";
import PropTypes from "prop-types";
import { useAuthContext } from "@/auth/useAuthContext";
import { GoogleLogin } from "@react-oauth/google";
import localStorageAvailable from "@/utils/localStorageAvailable";
import { APP_CONFIGS } from "@/config-global";
import { isValidToken } from "@/utils/jwt";
const HomeGoogleLogin = () => {
  const { loginWithGoogle, login } = useAuthContext();
  const storageAvailable = localStorageAvailable();
  const token = storageAvailable
    ? localStorage.getItem(APP_CONFIGS.keyToken)
    : "";

  const isShowOneTapLogin = !(token && isValidToken(token));

  const handleGoogleLogin = async (token: string) => {
    try {
      if (loginWithGoogle) {
        await loginWithGoogle(token);
      }
      console.log("GOOGLE LOGIN");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="hidden">
      <GoogleLogin
        onSuccess={(credentialResponse) =>
          handleGoogleLogin(credentialResponse?.credential ?? "")
        }
        onError={() => {
          // setNotification(t("auth:loginFail"));
        }}
        useOneTap={isShowOneTapLogin}
      />
    </div>
  );
};

HomeGoogleLogin.propTypes = {};

export default HomeGoogleLogin;
