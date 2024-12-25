import { useTranslation } from "@/app/i18n";
import Parser from "html-react-parser";

const PrivacyPage = async ({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) => {
  const { t } = await useTranslation(lng, ["common", "privacyAndTerm"]);
  return (
    <div className="w-full shrink-0 grow space-y-8 lg:w-2/3 lg:space-y-10 xl:w-3/4">
      <div className="listingSection__wrap !space-y-5">
        <h2 className="text-3xl font-semibold text-neutral-700 dark:text-neutral-200">
          {t("common:term")}
        </h2>
        {Parser(t("privacyAndTerm:termContent"))}
      </div>
    </div>
  );
};

export default PrivacyPage;
