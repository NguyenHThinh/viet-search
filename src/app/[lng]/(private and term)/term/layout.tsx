import { useTranslation as getTranslation } from "@/app/i18n";

export async function generateMetadata({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = await getTranslation(params.lng, ["common", "homepage"]);

  return {
    title: `${t("common:term")} | VietSearch`,
    description: t("homepage:heroDesc"),
    openGraph: {
      title: `${t("common:term")} | VietSearch`,
      description: t("homepage:heroDesc"),
    },
  };
}

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default CommonLayout;
