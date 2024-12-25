"use client";

import CommentImageListingDashboard from "@/components/CommentImageListingDashboard";
import { PATH_USER_DASHBOARD } from "@/contains/paths";
import { Comment } from "@/models/iCommentAndReview";
import { getUserReviews } from "@/services/dashboard";
import { deleteReview } from "@/services/reviews";
import CommonPagination from "@/shared/CommonPagination";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UpdateReviewForm from "../(components)/updateReviewForm";

export interface ReviewDashboardPageProps {}

const ReviewDashboardPage: FC<ReviewDashboardPageProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashBoard", "detail", "common"]);
  //
  const router = useRouter();
  const searchParams = useSearchParams();

  //
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [total, setTotal] = useState({ totalPages: 1, totalResults: 0 });

  //
  const [reviewsData, setReviewsData] = useState<Comment[]>([]);

  //
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [currentComment, setCurrentComment] = useState<Comment | null>(null);

  //
  const handleGetReviewed = async (page: number) => {
    const data = await getUserReviews(page);
    setTotal({
      totalPages: data?.totalPages ?? 1,
      totalResults: data.totalResults ?? 0,
    });
    return data?.results;
  };

  //
  const { data, isLoading, refetch } = useQuery<Comment[]>({
    queryKey: ["usersReviews", currentPage],
    queryFn: () => handleGetReviewed(currentPage),
  });

  //
  useEffect(() => {
    data && setReviewsData(data);
  }, [data]);

  //
  const handleChangePage = (newPage: number) => {
    window.scrollTo(0, 0);
    setReviewsData([]);
    setCurrentPage(newPage);
    if (newPage === 1) {
      router.push(PATH_USER_DASHBOARD.accountReviews);
      return;
    }
    router.push(`?page=${newPage}`);
  };

  const handleDeleteReview = async (businessId: string, reviewId: string) => {
    await deleteReview(businessId, reviewId);
    refetch();
  };

  const handleCloseUpdateForm = () => {
    refetch();
    setIsOpenForm(false);
    setCurrentComment(null);
  };

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="w-full max-w-sm rounded-md">
          <div className="flex animate-pulse space-x-4">
            <div className="h-12 w-12 rounded-full bg-slate-300"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="_info space-y-2">
                <div className="_name h-4 rounded bg-slate-300"></div>
                <div className="_date h-3 w-2/3 rounded bg-slate-300"></div>
                <div className="_rating h-3 w-1/2 rounded bg-slate-300"></div>
              </div>
              <div className="_content space-y-3">
                <div className="_text h-4 rounded bg-slate-300"></div>
              </div>
            </div>
          </div>
        </div>
      );

    if (reviewsData.length === 0)
      return (
        <div className="w-full text-center">
          <span className="text-xl font-medium ">
            {t("detail:notHaveComments")}
          </span>
        </div>
      );

    return reviewsData.map((item, index) => (
      <div key={index}>
        <CommentImageListingDashboard
          data={item}
          lang={i18n.language}
          onDelete={handleDeleteReview}
          onUpdate={(commentData: Comment) => {
            setCurrentComment(commentData);
            setIsOpenForm(true);
          }}
        />
      </div>
    ));
  };

  const renderSection = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">{`${t("dashBoard:reviews")} ${total.totalResults ? `(${total.totalResults} ${t("dashBoard:reviews")})` : ""}`}</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* comment */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {renderContent()}
          <div className="mt-5 flex justify-center">
            <CommonPagination
              paging={{ currentPage, totalPages: total.totalPages }}
              onChangePage={handleChangePage}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full shrink-0 space-y-8">
      {currentComment && (
        <UpdateReviewForm
          data={currentComment}
          isOpenForm={isOpenForm}
          onCloseForm={handleCloseUpdateForm}
        />
      )}
      {renderSection()}
    </div>
  );
};

export default ReviewDashboardPage;
