import { withI18nMiddleware } from "@/middlewares/withI18nMiddleware";
import { chain } from "@/middlewares/chain";
import { withAuthMiddleware } from "@/middlewares/withAuthMiddleware";

export const config = {
  // matcher: '/:lng*'
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
};

export default chain([withI18nMiddleware, withAuthMiddleware]);
