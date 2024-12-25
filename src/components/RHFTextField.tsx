"use client";

import FormItem from "@/app/[lng]/(business)/add-business/components/FormItem";
import { useTranslation } from "@/app/i18n/client";
import Input from "@/shared/Input";
import { FC } from "react";
import {
  Controller,
  FieldErrors,
  FieldErrorsImpl,
  useFormContext,
} from "react-hook-form";

interface RHFTextFieldProps {
  name: string;
  className?: string;
  label?: string;
  desc?: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (e: any) => void;
}

const RHFTextField: FC<RHFTextFieldProps> = ({
  name,
  className = "",
  label = "",
  desc = "",
  placeholder = "",
  required,
  onChange,
}) => {
  const { t } = useTranslation(["addBusiness"]);
  const {
    clearErrors,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem
          className={className}
          required={required}
          label={label}
          desc={desc}
        >
          <Input
            {...field}
            value={field.value}
            placeholder={placeholder}
            className={errors?.name && "border-red-500"}
            onFocus={() => {
              clearErrors(name);
            }}
            onChange={(e) => {
              field.onChange(e);
              onChange && onChange(e);
            }}
          />
          {errors?.name && (
            <p className="ml-1 mt-1 text-sm text-red-500">
              {String(errors?.name?.message) ||
                t("addBusiness:error.missingField")}
            </p>
          )}
        </FormItem>
      )}
    />
  );
};

export default RHFTextField;
