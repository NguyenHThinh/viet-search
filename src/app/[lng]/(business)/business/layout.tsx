import { useTranslation as getTranslation } from "@/app/i18n";

export async function generateMetadata({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = await getTranslation(params.lng, ["businessPage", "common"]);

  return {
    title: `${t("common:vietSearchForBusiness")} | VietSearch`,
    description: t("businessPage:turnPeopleFind"),
    openGraph: {
      title: `${t("common:vietSearchForBusiness")} | VietSearch`,
      description: t("businessPage:turnPeopleFind"),
    },
  };
}

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default CommonLayout;
