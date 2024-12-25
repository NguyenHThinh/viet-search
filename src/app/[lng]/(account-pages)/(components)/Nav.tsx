"use client";

import { PATH_USER_DASHBOARD } from "@/contains/paths";
import { Route } from "@/routers/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const Nav = () => {
  const pathname = usePathname();

  const pathnameWithoutLang = "/" + pathname.split("/").slice(2).join("/");

  const listNav: Route[] = [
    PATH_USER_DASHBOARD.account,
    PATH_USER_DASHBOARD.accountWishlist,
    PATH_USER_DASHBOARD.accountPassword,
    PATH_USER_DASHBOARD.accountReviews,
    // PATH_USER_DASHBOARD.accountBilling,
  ];

  return (
    <div className="container">
      <div className="hiddenScrollbar flex space-x-8 overflow-x-auto md:space-x-14">
        {listNav.map((item) => {
          const isActive = pathnameWithoutLang === item;
          return (
            <Link
              key={item}
              href={item}
              className={`block shrink-0 border-b-2 py-5 capitalize md:py-8 ${
                isActive
                  ? "border-primary-500 font-medium"
                  : "border-transparent"
              }`}
            >
              {item.replace("-", " ").replace("/", "")}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
