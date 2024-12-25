import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React from "react";

import type { TaxonomyType } from "@/data/types";
import Badge from "@/shared/Badge";
import convertNumbThousand from "@/utils/convertNumbThousand";

export interface CardCategoryBox1Props {
  className?: string;
  taxonomy: TaxonomyType;
}

const CardCategoryBox1: FC<CardCategoryBox1Props> = ({
  className = "",
  taxonomy,
}) => {
  const { count, name, thumbnail, href = "/" } = taxonomy;
  return (
    <Link
      href={href}
      className={`nc-CardCategoryBox1 [ nc-box-has-hover ] [ nc-dark-box-bg-has-hover ] relative flex items-center p-3 sm:p-6  ${className}`}
    >
      <Badge
        className="absolute right-2 top-2"
        color="gray"
        name={convertNumbThousand(count)}
      />

      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
        <Image
          src={thumbnail || ""}
          fill
          alt=""
          sizes="(max-width: 400px) 100vw, 400px"
        />
      </div>
      <div className="ml-4 grow overflow-hidden">
        <h2 className="text-base font-medium">
          <span className="line-clamp-1">{name}</span>
        </h2>
        <span className="mt-2 block text-sm text-neutral-500 dark:text-neutral-400">
          19 minutes drive
        </span>
      </div>
    </Link>
  );
};

export default CardCategoryBox1;
