"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React from "react";

import facebookSvg from "@/images/Facebook.svg";
import googleSvg from "@/images/Google.svg";
import twitterSvg from "@/images/Twitter.svg";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
// auth
import { GoogleLogin } from "@react-oauth/google";
import { useAuthContext } from "@/auth/useAuthContext";
import { PATH_AUTH } from "@/contains/paths";
import GuestGuard from "@/auth/GuestGuard";
import Login from "@/app/[lng]/(auth)/login/login";

export interface PageLoginProps {}

const PageLogin: FC<PageLoginProps> = ({}) => {
  return (
    <GuestGuard>
      <Login />
    </GuestGuard>
  );
};

export default PageLogin;
