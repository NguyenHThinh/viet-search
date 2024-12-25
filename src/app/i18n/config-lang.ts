import ic_vn_flag from "@/images/flag/ic_flag_vn.svg";
import ic_en_flag from "@/images/flag/ic_flag_en.svg";

export const allLangs = [
  {
    label: "Tiếng Việt",
    value: "vi",
    // systemValue: viVN,
    icon: ic_vn_flag,
  },
  {
    label: "English",
    value: "en",
    // systemValue: enUS,
    icon: ic_en_flag,
  },
];

export const fallbackLng = allLangs?.[0]?.value ?? "vi";
export const languages = allLangs.map((lang) => lang.value);
export const defaultNS = "common";
export const cookieName = "18next";

export function getOptions(
  lng = fallbackLng,
  ns: string | string[] = defaultNS,
) {
  return {
    // debug: true,
    supportedLngs: languages,
    // preload: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    // backend: {
    //   projectId: '01b2e5e8-6243-47d1-b36f-963dbb8bcae3'
    // }
  };
}
