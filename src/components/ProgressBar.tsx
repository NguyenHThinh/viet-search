"use client";

import { useEffect, useState } from "react";
import NProgress from "nprogress";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

const ProgressBar = () => {
  let pathname = usePathname();
  let searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();
    handleStop();

    return () => {
      handleStart();
    };
  }, [pathname, searchParams]);

  return null;
};

export default ProgressBar;
