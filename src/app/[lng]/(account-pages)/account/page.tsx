"use client";
import React, { FC, MouseEvent, useState } from "react";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import Textarea from "@/shared/Textarea";
import { useAuthContext } from "@/auth/useAuthContext";
import { FormProvider, useForm } from "react-hook-form";
import AvatarCrop from "../(components)/AvatarCrop";
import { useTranslation } from "@/app/i18n/client";
import RHFTextField from "@/components/RHFTextField";
import { updateUserInfo } from "@/services/users";
import { useToast } from "@/hooks/useToast";
import _ from "lodash";

export interface UserFormSchema {
  name?: string;
  gender?: string;
  phone?: string;
  address?: string;
  about?: string;
  avatar?: string;
  dateOfBirth?: string;
}

export interface AccountPageProps {}

const AccountPage = () => {
  const { t } = useTranslation(["account"]);
  const { user, refetchUserInfo } = useAuthContext();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<UserFormSchema>({
    defaultValues: {
      name: user?.name ?? "",
      gender: user?.gender ?? "male",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      about: user?.about ?? "",
      avatar: user?.avatar ?? "",
      dateOfBirth: user?.dateOfBirth ?? "",
    },
  });

  const onSubmit = async (data: UserFormSchema) => {
    setIsLoading(true);
    try {
      const filteredData = _.omitBy(
        data,
        (value) => _.isNil(value) || value === "",
      );
      const response = await updateUserInfo(filteredData);
      if (response) {
        refetchUserInfo();
        showToast("success", t("account:successUpdate"));
      } else {
        showToast("error", t("account:failUpdate"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">{t("account:accountInfo")}</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row">
            <div className="flex shrink-0 items-start">
              <div className="relative flex overflow-hidden rounded-full">
                <AvatarCrop
                  onImageChange={(url) => {
                    methods.setValue("avatar", url);
                  }}
                />
              </div>
            </div>
            {/* leftside info */}
            <div className="mt-10 max-w-3xl grow space-y-6 md:mt-0 md:pl-16">
              <RHFTextField
                className="space-y-1.5"
                name="name"
                label={t("account:name")}
              />
              {/* <div>
                <Label>{t("account:name")}</Label>
                <Input className="mt-1.5" defaultValue={user?.name ?? ""} />
              </div> */}
              {/* ---- */}
              <div>
                <Label>{t("account:gender.root")}</Label>
                <Select
                  className="mt-1.5"
                  onChange={(e) => methods.setValue("gender", e.target.value)}
                >
                  <option value="male">{t("account:gender.male")}</option>
                  <option value="female">{t("account:gender.female")}</option>
                  <option value="other">{t("account:gender.other")}</option>
                </Select>
              </div>
              {/* ---- */}
              <div className="max-w-lg">
                <Label>{t("account:dayOfBirth")}</Label>
                <Input
                  className="mt-1.5"
                  type="date"
                  defaultValue={user?.dateOfBirth?.slice(0, 10)}
                  onChange={(e) =>
                    methods.setValue("dateOfBirth", e.target.value)
                  }
                />
              </div>
              {/* ---- */}
              <RHFTextField
                className="space-y-1.5"
                name="address"
                label={t("account:address")}
              />
              {/* ---- */}
              <RHFTextField
                className="space-y-1.5"
                name="phone"
                label={t("account:phone")}
              />
              {/* ---- */}
              <div>
                <Label>{t("account:aboutYou")}</Label>
                <Textarea
                  className="mt-1.5"
                  defaultValue="..."
                  {...methods.register("about")}
                />
              </div>
              <div className="pt-2">
                <ButtonPrimary loading={isLoading} type="submit">
                  {t("account:updateInfo")}
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AccountPage;
