import "i18next";
import Resources from "./resources";
import { defaultNS } from "@/app/i18n/config-lang";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: defaultNS;
    resources: Resources;
  }
}
