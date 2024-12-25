import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { CustomMiddleware } from "./chain";
import { PATH_AUTH, PATH_PAGE, PATH_USER_DASHBOARD } from "@/contains/paths";
import { APP_CONFIGS } from "@/config-global";
import API from "@/utils/api";
import { COOKIE_NAMES } from "@/constants";

const loggedOutPath = Object.values(PATH_AUTH);
const loggedInPath = [
  PATH_PAGE.addListing,
  ...Object.values(PATH_USER_DASHBOARD),
];
export function withAuthMiddleware(
  middleware: CustomMiddleware,
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const token = request.cookies.get(APP_CONFIGS.keyToken)?.value ?? "";
    let verifiedToken = false;

    try {
      const user: any = await API.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      verifiedToken = !!user?.email;
    } catch (e) {}

    // Redirect to login if not verified and accessing a protected route

    // if (
    //   loggedInPath.some((path) => request.nextUrl.pathname.includes(path)) &&
    //   !verifiedToken
    // ) {
    //   const res = NextResponse.redirect(new URL(PATH_AUTH.login, request.url));
    //   res.cookies.set(
    //     COOKIE_NAMES.callbackUrl,
    //     request.nextUrl.pathname + request.nextUrl.search,
    //   );
    //   return res;
    // }

    // Redirect to home if verified and accessing a logged-out-only route
    if (
      loggedOutPath.some((path) => request.nextUrl.pathname.includes(path)) &&
      verifiedToken
    ) {
      return NextResponse.redirect(new URL(PATH_PAGE.root, request.url));
    }

    // Proceed with the middleware
    return middleware(request, event, response);
  };
}
