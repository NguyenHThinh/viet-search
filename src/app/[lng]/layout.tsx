import "../globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";

import { Poppins, Inter } from "next/font/google";

import Footer from "@/components/Footer";
import FooterNav from "@/components/FooterNav";

import SiteHeader from "./(client-components)/(Header)/SiteHeader";
import ClientCommons from "./ClientCommons";

import { dir } from "i18next";
import { languages, fallbackLng } from "@/app/i18n/config-lang";
import { useTranslation as getTranslation } from "@/app/i18n";
import { SuggestionsProvider } from "@/contexts/suggestionContext";
import { BusinessProvider } from "@/contexts/searchContext";
import QueryProviders from "@/contexts/reactQueryContext";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/JwtContext";

// Google
import { GoogleOAuthProvider } from "@react-oauth/google";
import { APP_CONFIGS } from "@/config-global";
import ProgressBar from "@/components/ProgressBar";
import ToastProvider from "@/components/ToastProvider";
import Script from "next/script";
import GoogleCaptchaWrapper from "@/components/GoogleCaptchaWrapper";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  if (languages.indexOf(lng) < 0) lng = fallbackLng;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await getTranslation(lng, ["common", "homepage"]);
  return {
    title: t("home"),
    description: t("homepage:heroDesc"),
    icons: {
      icon: "https://vietsearch.sfo2.cdn.digitaloceanspaces.com/images/vietsearch-favicon.ico",
    },
    openGraph: {
      title: `${t("homepage:heroTitle")} | VietSearch`,
      description: t("homepage:heroDesc"),
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  const fonts = lng === "vi" ? inter : poppins;
  return (
    <html lang={lng} dir={dir(lng)} className={`${fonts.className} mdl-js`}>
      <body className="bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
        <AuthProvider>
          <GoogleOAuthProvider clientId={APP_CONFIGS.googleClientId}>
            <GoogleCaptchaWrapper>
              <QueryProviders>
                <SuggestionsProvider lang={lng}>
                  <Suspense>
                    <BusinessProvider lng={lng}>
                      <ToastProvider>
                        <>
                          <ProgressBar />
                          <ClientCommons />
                          <SiteHeader lng={lng} />
                          {children}
                          <FooterNav />
                          <Footer />
                        </>
                      </ToastProvider>
                    </BusinessProvider>
                  </Suspense>
                </SuggestionsProvider>
              </QueryProviders>
            </GoogleCaptchaWrapper>
          </GoogleOAuthProvider>
        </AuthProvider>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LCNHBZCKG0"
          strategy="afterInteractive"
        />
        <Script
          id="gtag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-LCNHBZCKG0');
            `,
          }}
        />
      </body>
    </html>
  );
}
