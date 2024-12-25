import type { FC } from "react";
import React from "react";

import twFocusClass from "@/utils/twFocusClass";
import NextBtn from "@/components/NextBtn";
import PrevBtn from "@/components/PrevBtn";
import useBusinessSearchContext from "@/hooks/useBusinessSearchContext";

export interface PaginationProps {
  className?: string;
}

const BusinessPagination: FC<PaginationProps> = ({ className = "" }) => {
  const { total, setFilter, searchParams } = useBusinessSearchContext();

  const totalPagesCount =
    Math.ceil(Number(total?.value) / Number(searchParams?.size)) || 0;

  const totalPage = Array.from(
    { length: totalPagesCount },
    (_, index) => index + 1,
  );

  const currentPage = Number(searchParams?.start) / Number(searchParams?.size);

  const leftTerm = totalPagesCount > 8 ? (currentPage + 1 <= 4 ? 5 : 1) : 8;
  const leftCenterTerm = currentPage - 2; // currentPage + 1(currenPage start in 0) - 3(slide get 2 after current index)
  const rightCenterTerm = currentPage + 3; // currentPage + 1(currenPage start in 0) + 2(slide get 2 after current index)
  const rightTerm = currentPage < totalPagesCount - 4 ? 1 : 5;

  const renderItem = (page: number, index: number) => {
    if (page === currentPage + 1) {
      // RETURN ACTIVE PAGINATION
      return (
        <span
          key={index}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-6000 text-white lg:h-11 lg:w-11 ${twFocusClass()}`}
        >
          {page}
        </span>
      );
    }
    // RETURN UNACTIVE PAGINATION
    return (
      <button
        key={index}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-6000 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 lg:h-11 lg:w-11 ${twFocusClass()}`}
        // href={pag.href as Route}
        onClick={() =>
          setFilter({
            start: String(Number(searchParams?.size) * (page - 1)),
          })
        }
      >
        {page}
      </button>
    );
  };

  if (totalPagesCount <= 1) {
    return <></>;
  }

  return (
    <nav
      className={`nc-Pagination inline-flex items-center space-x-1 text-base font-medium ${className}`}
    >
      {currentPage > 0 && (
        <PrevBtn
          onClick={() =>
            setFilter({
              start: String(Number(searchParams?.size) * (currentPage - 1)),
            })
          }
        />
      )}
      {totalPage.slice(0, leftTerm).map((pag, index) => renderItem(pag, index))}
      {totalPagesCount > 8 && (
        <a>
          <span className="text-sm lg:mx-3 lg:text-base">...</span>
        </a>
      )}
      {currentPage >= 4 &&
        currentPage < totalPagesCount - 4 &&
        totalPage
          .slice(leftCenterTerm, rightCenterTerm)
          .map((pag, index) => renderItem(pag, index))}
      {currentPage >= 4 && currentPage < totalPagesCount - 4 && (
        <a>
          <span className="text-sm lg:mx-3 lg:text-base">...</span>
        </a>
      )}
      {totalPagesCount > 8 &&
        totalPage.slice(-rightTerm).map((pag, index) => renderItem(pag, index))}
      {currentPage < totalPagesCount - 1 && (
        <NextBtn
          onClick={() =>
            setFilter({
              start: String(Number(searchParams?.size) * (currentPage + 1)),
            })
          }
        />
      )}
    </nav>
  );
};

export default BusinessPagination;
