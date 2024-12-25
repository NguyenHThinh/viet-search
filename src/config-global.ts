// routes
// import { PATH_DASHBOARD } from './routes/paths';

// APP CONFIG
// ----------------------------------------------------------------------

import { env } from "process";

export const APP_CONFIGS = {
  appName: env.NEXT_PUBLIC_APP_NAME || "VietSearch Business",
  googleClientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  googleMapKey: env.GGMAP_KEY || "",
  catsbusinessValue: "categoriesValue",
  keyToken: "accessToken",
  keyRefreshToken: "refreshToken",
  apiUrl: env.NEXT_PUBLIC_API_URL || "https://api.vietsearch.org/api",
  slackApiHook: env.NEXT_PUBLIC_SLACK_API_HOOK || "",
  recaptchaPublicKey: env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY || "",
  recaptchaEnabled: env.NEXT_PUBLIC_RECAPTCHA_ENABLED || "false",
};
