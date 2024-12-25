import { useTranslation as getTranslation } from "@/app/i18n";

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
    lng: string;
  };
}) {
  const { t } = await getTranslation(params.lng, ["common", "homepage"]);

  return {
    title: `${t("common:auth.login")} | VietSearch`,
    description: t("homepage:heroDesc"),
    openGraph: {
      title: `${t("common:auth.login")} | VietSearch`,
      description: t("homepage:heroDesc"),
    },
  };
}

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default CommonLayout;
