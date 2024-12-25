import { useTranslation as getTranslation } from "@/app/i18n";

export async function generateMetadata({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = await getTranslation(params.lng, ["addBusiness", "homepage"]);

  return {
    title: `${t("addBusiness:logo")} | VietSearch`,
    description: t("homepage:heroDesc"),
    openGraph: {
      title: `${t("addBusiness:logo")} | VietSearch`,
      description: t("homepage:heroDesc"),
    },
  };
}

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default CommonLayout;
