"use client";

import { useTranslation } from "@/app/i18n/client";
import { FormProvider, useForm } from "react-hook-form";
import { IBusiness } from "@/models/iBusiness";
import { FC, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { useToast } from "@/hooks/useToast";
import RHFFileInput from "@/components/uploadImages/RHFFileInput";
import { claimManual } from "@/services/claimBusiness";
import { isEmail } from "@/utils/validator";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import AddContact from "../../add-business/components/AddContact";

export interface ClaimManualFormtype {
  data: {
    // businessEmail: string;
    contacts: { type: string; value: string }[];
  };
  relicenses: File[];
}

export interface FormNewInfoClaimProps {
  businessData: IBusiness | null;
  setSuccessManual: (success: boolean) => void;
}

const FormNewInfoClaim: FC<FormNewInfoClaimProps> = ({
  businessData,
  setSuccessManual,
}) => {
  const { t } = useTranslation(["claim", "common"]);
  const { showToast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<ClaimManualFormtype>({
    mode: "onChange",
    defaultValues: {
      data: {
        // businessEmail: "",
        contacts: [{ type: "email", value: "" }],
      },
      relicenses: [],
    },
  });

  const clearFormData = (formData: ClaimManualFormtype) => {
    const cleanedFormData = {
      ...formData,
      // clear empty contact value
      data: {
        ...formData.data,
        contacts: formData.data.contacts.filter(
          (contact: { type: string; value: string }) =>
            contact.value.trim() !== "",
        ),
      },
    };
    return cleanedFormData;
  };

  const onSubmit = async () => {
    setError(null);
    const formData = new FormData();
    // clear form data
    const formValues = clearFormData(methods.getValues());
    // use to check email available
    const businessEmail = formValues.data.contacts.find(
      (contact) => contact.type === "email",
    )?.value;

    const hasBusinessLicense = formValues.relicenses.length > 0;

    if (!businessEmail) {
      showToast("error", t("common:emailNotFound"));
      setError(t("common:emailNotFound"));
      return;
    }

    if (!isEmail(businessEmail)) {
      showToast("error", t("common:invalidEmailFormat"));
      setError(t("common:invalidEmailFormat"));
      return;
    }

    if (!hasBusinessLicense) {
      showToast("error", t("claim:requiredBusinessLicenses"));
      setError(t("claim:requiredBusinessLicenses"));
      return;
    }

    // formData.data.businessEmail = businessEmail;
    formData.append("data", JSON.stringify(formValues.data));

    if (formValues.relicenses.length === 1) {
      formData.set("relicenses", formValues.relicenses[0]);
    } else {
      formValues.relicenses.forEach((file: File) => {
        formData.append("relicenses", file);
      });
    }

    const recaptchaToken = await getRecaptchaToken();
    setIsLoading(true);
    try {
      await claimManual(businessData?.id || "", formData, recaptchaToken);
      setSuccessManual(true);
      window.scrollTo(0, 0);
      showToast("success", t("claim:submitSuccess"));
    } catch (error: any) {
      if (error.message === "already requested")
        setError(t("claim:alreadyRequested"));
      showToast("error", t("claim:alreadyRequested"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full cursor-default space-y-8">
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="space-y-3">
            <p className="text-sm font-medium">{t("claim:firstEmailInList")}</p>
            <AddContact name="data.contacts" hasLabel={false} />
          </div>
          <div className="space-y-3">
            <p className="text-base font-medium">
              {t("claim:businessRelicense")}
            </p>
            <RHFFileInput name="relicenses" isMultiple />
          </div>
          {error && <p className="ml-1 mt-1 text-red-500">{error}</p>}
          <ButtonPrimary
            loading={isLoading}
            type="submit"
            className="!px-6 !py-3 text-lg"
          >
            {t("claim:submit")}
          </ButtonPrimary>
        </form>
      </div>
    </FormProvider>
  );
};

export default FormNewInfoClaim;
