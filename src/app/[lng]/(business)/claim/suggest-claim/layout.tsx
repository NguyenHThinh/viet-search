import { useTranslation as getTranslation } from "@/app/i18n";
import AuthGuard from "@/auth/AuthGuard";

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
    lng: string;
  };
}) {
  const { t } = await getTranslation(params.lng, ["claim", "homepage"]);

  return {
    title: `${t("claim:verifyClaimBusiness")} | VietSearch`,
    description: t("homepage:heroDesc"),
    openGraph: {
      title: `${t("claim:verifyClaimBusiness")} | VietSearch`,
      description: t("homepage:heroDesc"),
    },
  };
}

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default CommonLayout;
