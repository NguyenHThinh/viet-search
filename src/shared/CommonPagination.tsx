import type { FC } from "react";
import React from "react";

import twFocusClass from "@/utils/twFocusClass";
import NextBtn from "@/components/NextBtn";
import PrevBtn from "@/components/PrevBtn";

export interface PaginationProps {
  paging: {
    currentPage: number; // start with 1
    totalPages: number; // start with 0
  };
  className?: string;
  onChangePage: (page: number) => void;
}

const CommonPagination: FC<PaginationProps> = ({
  paging: { currentPage, totalPages },
  className = "",
  onChangePage,
}) => {
  const leftTerm = totalPages > 8 ? (currentPage <= 4 ? 5 : 1) : 8;
  const leftCenterTerm = currentPage - 3; //  3(slide get 2 after current index and position of index now is 1)
  const rightCenterTerm = currentPage + 2; // 2(slide get 2 after current index)
  const rightTerm = currentPage < totalPages - 3 ? 1 : 5;

  const arrPages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const renderItem = (page: number, index: number) => {
    if (page === currentPage) {
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
        onClick={() => onChangePage(page)}
      >
        {page}
      </button>
    );
  };

  if (totalPages <= 1) {
    return <></>;
  }

  return (
    <nav
      className={`nc-Pagination inline-flex items-center space-x-1 text-base font-medium ${className}`}
    >
      {currentPage > 1 && (
        <PrevBtn onClick={() => onChangePage(currentPage - 1)} />
      )}
      {arrPages.slice(0, leftTerm).map((pag, index) => renderItem(pag, index))}
      {totalPages > 8 && (
        <a>
          <span className="text-sm lg:mx-3 lg:text-base">...</span>
        </a>
      )}
      {currentPage > 4 &&
        currentPage < totalPages - 3 &&
        arrPages
          .slice(leftCenterTerm, rightCenterTerm)
          .map((pag, index) => renderItem(pag, index))}
      {currentPage > 4 && currentPage < totalPages - 3 && (
        <a>
          <span className="text-sm lg:mx-3 lg:text-base">...</span>
        </a>
      )}
      {totalPages > 8 &&
        arrPages.slice(-rightTerm).map((pag, index) => renderItem(pag, index))}
      {currentPage < totalPages && (
        <NextBtn onClick={() => onChangePage(currentPage + 1)} />
      )}
    </nav>
  );
};

export default CommonPagination;
