import type { FC } from "react";
import React from "react";

import twFocusClass from "@/utils/twFocusClass";
import NextBtn from "@/components/NextBtn";
import PrevBtn from "@/components/PrevBtn";

export interface PaginationProps {
  className?: string;
  totalPages: number;
  onChangePage: (page: number) => void;
  currentPage: number;
}

const WishlistPagination: FC<PaginationProps> = ({
  className = "",
  totalPages,
  currentPage,
  onChangePage,
}) => {
  const totalPage = Array.from({ length: totalPages }, (_, index) => index + 1);

  const leftTerm = totalPages > 8 ? (currentPage + 1 <= 4 ? 5 : 1) : 8;
  const leftCenterTerm = currentPage - 2; // currentPage + 1(currenPage start in 0) - 3(slide get 2 after current index)
  const rightCenterTerm = currentPage + 3; // currentPage + 1(currenPage start in 0) + 2(slide get 2 after current index)
  const rightTerm = currentPage < totalPages - 4 ? 1 : 5;

  const renderItem = (pag: number, index: number) => {
    if (pag === currentPage) {
      // RETURN ACTIVE PAGINATION
      return (
        <span
          key={index}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-6000 text-white lg:h-11 lg:w-11 ${twFocusClass()}`}
        >
          {pag}
        </span>
      );
    }
    // RETURN UNACTIVE PAGINATION
    return (
      <button
        key={index}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-6000 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 lg:h-11 lg:w-11 ${twFocusClass()}`}
        onClick={() => onChangePage(pag)}
      >
        {pag}
      </button>
    );
  };

  if (totalPages <= 1) {
    return <></>;
  }

  return (
    <nav
      className={`nc-Pagination flex flex-row items-center justify-center space-x-1 text-base font-medium ${className}`}
    >
      {currentPage > 1 && (
        <PrevBtn onClick={() => onChangePage(currentPage - 1)} />
      )}
      {totalPage.slice(0, leftTerm).map((pag, index) => renderItem(pag, index))}
      {totalPages > 8 && (
        <a>
          <span className="text-sm lg:mx-3 lg:text-base">...</span>
        </a>
      )}
      {currentPage >= 4 &&
        currentPage < totalPages - 4 &&
        totalPage
          .slice(leftCenterTerm, rightCenterTerm)
          .map((pag, index) => renderItem(pag, index))}
      {currentPage >= 4 && currentPage < totalPages - 4 && (
        <a>
          <span className="text-sm lg:mx-3 lg:text-base">...</span>
        </a>
      )}
      {totalPages > 8 &&
        totalPage.slice(-rightTerm).map((pag, index) => renderItem(pag, index))}
      {currentPage < totalPages && (
        <NextBtn onClick={() => onChangePage(currentPage + 1)} />
      )}
    </nav>
  );
};

export default WishlistPagination;
