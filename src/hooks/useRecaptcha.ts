import { APP_CONFIGS } from "@/config-global";
import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function useRecaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const NO_CAPTCHA_COUNTRY: string[] = [];

  const checkEnableCaptcha = (detectedCountry: string, email: string) => {
    const testEmails = ["@gmail.com"];
    if (email) {
      return (
        NO_CAPTCHA_COUNTRY.indexOf(detectedCountry) === -1 &&
        !testEmails.includes(email)
      );
    } else {
      return NO_CAPTCHA_COUNTRY.indexOf(detectedCountry) === -1;
    }
  };

  // get recaptcha token
  const getRecaptchaToken = useCallback(
    async (action = "DEFAULT_ACTION") => {
      const isRecaptchaEnable = APP_CONFIGS.recaptchaEnabled === "true";

      if (!isRecaptchaEnable) {
        console.error("Recaptcha is disable");
        return null;
      }

      if (!executeRecaptcha) {
        console.error("Recaptcha not loaded");
        return null;
      }

      // handle check flag on/off recaptcha

      try {
        const reCaptchaToken = await executeRecaptcha(action);
        return reCaptchaToken;
      } catch (error) {
        console.error("Recaptcha error:", error);
        return null;
      }
    },
    [executeRecaptcha],
  );

  return { getRecaptchaToken };
}
