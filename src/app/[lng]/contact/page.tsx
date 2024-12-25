"use client";

import React, { FC, useState } from "react";
import SocialsList from "@/shared/SocialsList";
import Label from "@/components/Label";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sendContactForm } from "@/services/slack";
import * as yup from "yup";
import { ContactForm } from "@/models/iContactForm";
import { useTranslation } from "@/app/i18n/client";
import { useToast } from "@/hooks/useToast";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { RECAPTCHA_ACTION } from "@/constants";

const ContactUsSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email("Invalid email").required(),
  message: yup.string().required(),
});

const PageContact = () => {
  const { showToast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();
  const { t } = useTranslation(["common", "footer", "contact"]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(ContactUsSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactForm) => {
    const recaptchaToken = await getRecaptchaToken(RECAPTCHA_ACTION.contact);
    setIsLoading(true);
    const slackData = {
      attachments: [
        {
          fallback: `${data?.name} send contact form from https://vietsearch.org/contact-us`,
          color: "#36a64f",
          author_name: data?.name,
          author_link: "https://admin.vietsearch.org/",
          author_icon:
            "https://s3.amazonaws.com/static.vietsearch.org/images/logo-color.png",
          title: `${data?.name} - ${data?.email}`,
          title_link: "https://vietsearch.org/contact-us",
          text: data?.message,
          ts: new Date().valueOf(),
        },
      ],
    };

    await sendContactForm(slackData, recaptchaToken)
      .then((res) => {
        showToast("success", t("contact:submitSuccess"));
        reset({
          name: "",
          email: "",
          message: "",
        });
      })
      .catch((error) => {
        showToast("error", t("contact:submitFailed"));
        console.error("Error sending message:", error.response?.data || error);
      });
    setIsLoading(false);
  };

  const info = [
    {
      title: `🗺 ${t("contact:name")}`,
      desc: t("contact:VSname"),
    },
    {
      title: "💌 EMAIL",
      desc: "contact@vietsearch.org",
    },
  ];

  return (
    <div className={`nc-PageContact overflow-hidden`}>
      <div className="mb-24 lg:mb-32">
        <h2 className="my-16 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 sm:my-20 md:text-5xl md:leading-[115%]">
          {t("common:contacts")}
        </h2>
        <div className="container mx-auto max-w-7xl">
          <div className="grid shrink-0 grid-cols-1 gap-12 sm:grid-cols-2 ">
            <div className="max-w-sm space-y-8">
              {info.map((item, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider dark:text-neutral-200">
                    {item.title}
                  </h3>
                  <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
                    {item.desc}
                  </span>
                </div>
              ))}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider dark:text-neutral-200">
                  🌏 {t("footer:community")}
                </h3>
                <SocialsList className="mt-2" />
              </div>
            </div>
            <div>
              <form
                className="grid grid-cols-1 gap-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <label className="block">
                  <Label>{t("contact:fullName")}</Label>

                  <Input
                    placeholder="Example Doe"
                    type="text"
                    className="mt-1"
                    {...register("name")}
                  />

                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </label>
                <label className="block">
                  <Label>{t("contact:emailAddress")}</Label>

                  <Input
                    type="email"
                    placeholder="example@example.com"
                    className="mt-1"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </label>
                <label className="block">
                  <Label>{t("contact:message")}</Label>

                  <Textarea
                    className="mt-1"
                    rows={6}
                    {...register("message")}
                  />

                  {errors.message && (
                    <p className="text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </label>
                <div>
                  <ButtonPrimary type="submit" loading={isLoading}>
                    {t("contact:sendMessage")}
                  </ButtonPrimary>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* OTHER SECTIONS */}
      {/* <div className="container">
        <SectionSubscribe2 className="pb-24 lg:pb-32" />
      </div> */}
    </div>
  );
};

export default PageContact;
