"use client";

import PropTypes from "prop-types";
import { useEffect, ReactNode } from "react";
// next
import { usePathname, useRouter } from "next/navigation";
// routes
import { PATH_PAGE } from "@/contains/paths";
// components
// import LoadingScreen from '../components/loading-screen';
//
import { useAuthContext } from "./useAuthContext";
import LoadingScreen from "@/components/loading-screen";
import { deleteCookie, getCookie } from "cookies-next";
import { COOKIE_NAMES } from "@/constants";
import { ca } from "date-fns/locale";

// ----------------------------------------------------------------------

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard = ({ children }: GuestGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthContext();
  const pathname = usePathname();
  const callbackUrl = getCookie(COOKIE_NAMES.callbackUrl);
  useEffect(() => {
    if (!router) return; // Ensure router is available before using it
    if (isAuthenticated) {
      // If enable auth in withMiddleware
      //   if (callbackUrl) deleteCookie(COOKIE_NAMES.callbackUrl);
      //   callbackUrl ? router.push(callbackUrl) : router.push(PATH_PAGE.root);
      router.push(PATH_PAGE.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);
  if (isInitialized === isAuthenticated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default GuestGuard;
