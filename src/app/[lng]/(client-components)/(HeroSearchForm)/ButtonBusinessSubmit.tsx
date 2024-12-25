import Link from "next/link";
import type { FC } from "react";
import React from "react";

import type { PathName } from "@/routers/types";
import _ from "lodash";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";
import useSuggestionContext from "@/hooks/useSuggestionContext";

interface Props {
  href?: PathName;
  value: {
    q: string;
    where: string;
  };
}

const ButtonBusinessSubmit: FC<Props> = ({ href = "/vi/search", value }) => {
  const { searchParams, setFilter } = useBusinessSearchContext();
  const { handleStoreSuggestions } = useSuggestionContext();

  //clear empty query
  const filteredSearchParams = _.pickBy(
    searchParams,
    (value) => value !== null && value !== undefined && value !== "",
  );

  return (
    <Link
      href={{
        pathname: href,
        //custom query (omit hidden query)
        query: {
          ..._.omit(filteredSearchParams, ["lang", "size", "facets"]),
          q: value?.q,
          where: value?.where,
        },
      }}
      type="button"
      onClick={(e) => {
        e.preventDefault();
        setFilter({ q: value?.q, where: value?.where });
        value?.q && handleStoreSuggestions(value?.q);
        value?.where && handleStoreSuggestions(value?.where, true);
      }}
      className="flex h-14 w-full items-center justify-center rounded-full bg-primary-6000 text-neutral-50 hover:bg-primary-700 focus:outline-none md:h-16 md:w-16"
    >
      <span className="mr-3 md:hidden">Search</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </Link>
  );
};

export default ButtonBusinessSubmit;
