import Label from "@/components/Label";
import React from "react";
import { FC } from "react";

export interface FormItemProps {
  className?: string;
  label?: string;
  desc?: string;
  children?: React.ReactNode;
  required?: boolean;
}

const FormItem: FC<FormItemProps> = ({
  children,
  className = "",
  label,
  desc,
  required,
}) => {
  return (
    <div className={className}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-600">*</span>}
        </Label>
      )}
      <div className="mt-1">{children}</div>
      {desc && (
        <span className="mt-3 block text-xs text-neutral-500 dark:text-neutral-400 ">
          {desc}
        </span>
      )}
    </div>
  );
};

export default FormItem;
