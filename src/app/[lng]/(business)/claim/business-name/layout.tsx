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
    title: `${t("claim:searchOrAddBusiness")} | VietSearch`,
    description: t("homepage:heroDesc"),
    openGraph: {
      title: `${t("claim:searchOrAddBusiness")} | VietSearch`,
      description: t("homepage:heroDesc"),
    },
  };
}

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <div className="ListingDetailPage__content container min-h-[650px]">
        {children}
      </div>
    </AuthGuard>
  );
};

export default CommonLayout;
