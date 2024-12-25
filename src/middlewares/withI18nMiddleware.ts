import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { CustomMiddleware } from "./chain";
import { cookieName, fallbackLng, languages } from "@/app/i18n/config-lang";
import acceptLanguage from "accept-language";

acceptLanguage.languages(languages);
export function withI18nMiddleware(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    if (
      request.nextUrl.pathname.indexOf("icon") > -1 ||
      request.nextUrl.pathname.indexOf("chrome") > -1
    )
      return NextResponse.next();
    let lng: string | undefined | null;
    if (request.cookies.has(cookieName))
      lng = acceptLanguage.get(request.cookies.get(cookieName)?.value);
    if (!lng) lng = acceptLanguage.get(request.headers.get("Accept-Language"));
    if (!lng) lng = fallbackLng;

    // Redirect if lng in path is not supported
    if (
      !languages.some((loc) =>
        request.nextUrl.pathname.startsWith(`/${loc}`),
      ) &&
      !request.nextUrl.pathname.startsWith("/_next")
    ) {
      const url = new URL(`/${lng}${request.nextUrl.pathname}`, request.url);
      url.search = request.nextUrl.search;
      return NextResponse.redirect(url);
    }

    if (request.headers.has("referer")) {
      const refererUrl = new URL(request.headers.get("referer") || "");
      const lngInReferer = languages.find((l) =>
        refererUrl.pathname.startsWith(`/${l}`),
      );
      const response = NextResponse.next();
      if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
      // return response;
    }

    return middleware(request, event, response);
  };
}
