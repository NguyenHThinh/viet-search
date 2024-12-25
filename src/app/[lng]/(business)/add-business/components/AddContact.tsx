"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import { useTranslation } from "@/app/i18n/client";
import { MinusCircleIcon } from "@heroicons/react/24/outline";

const AddContact = ({
  hasLabel = true,
  name = "contacts",
}: {
  hasLabel?: boolean;
  name?: string;
}) => {
  const { t } = useTranslation(["addBusiness"]);
  //
  const { control, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  const handleAddContact = () => {
    append({ type: "website", value: "" });
  };

  return (
    <div className="space-y-4">
      {hasLabel && (
        <h2 className="text-2xl font-semibold">
          {t("addBusiness:stepTitle.contacts")}
        </h2>
      )}
      {fields.map((item, index) => (
        <div
          className="flex w-full items-center justify-between gap-3"
          key={index}
        >
          <Controller
            name={`${name}.${index}.type`}
            control={control}
            defaultValue={getValues(`${name}.${index}.type`)}
            render={({ field }) => (
              <Select {...field} className="!h-11 w-max">
                <option value="website">
                  {t("addBusiness:contactTypes.website")}
                </option>
                <option value="mobile">
                  {t("addBusiness:contactTypes.mobile")}
                </option>
                <option value="fax">{t("addBusiness:contactTypes.fax")}</option>
                <option value="xcom">
                  {t("addBusiness:contactTypes.xcom")}
                </option>
                <option value="phone">
                  {t("addBusiness:contactTypes.phone")}
                </option>
                <option value="email">
                  {t("addBusiness:contactTypes.email")}
                </option>
                <option value="facebook">
                  {t("addBusiness:contactTypes.facebook")}
                </option>
                <option value="linkedin">
                  {t("addBusiness:contactTypes.linkedin")}
                </option>
                <option value="other">
                  {t("addBusiness:contactTypes.other")}
                </option>
              </Select>
            )}
          />
          <Controller
            name={`${name}.${index}.value`}
            control={control}
            defaultValue={getValues(`${name}.${index}.value`)}
            render={({ field }) => (
              <Input {...field} className="!h-full w-full" />
            )}
          />
          <MinusCircleIcon
            onClick={() => remove(index)}
            className="h-10 w-10 cursor-pointer text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          />
        </div>
      ))}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleAddContact}
          className="!h-11 w-max rounded-full border bg-[#2CA6D1] px-4 py-2 text-white hover:bg-[#57B8DB]"
        >
          {t("addBusiness:addContact")}
        </button>
      </div>
    </div>
  );
};

export default AddContact;
