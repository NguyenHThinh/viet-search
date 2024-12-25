"use client";

import { useTranslation } from "@/app/i18n/client";
import { useAuthContext } from "@/auth/useAuthContext";
import CommentImageListing from "@/components/CommentImageListing";
import RatingStar from "@/components/RatingStar";
import ShowRatingStar from "@/components/ShowRatingStar";
import UploadImage from "@/components/uploadImages/UploadImage";
import { useBusinessDetail } from "@/contexts/businessDetailContext";
import { Comment, Comments, ReviewFormData } from "@/models/iCommentAndReview";
import {
  addReview,
  deleteReview,
  getComments,
  updateReview,
} from "@/services/reviews";
import CommonPagination from "@/shared/CommonPagination";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface BusinessReviewsProps {
  rating: number;
}

const BusinessReviews: FC<BusinessReviewsProps> = ({ rating }) => {
  const { detailData } = useBusinessDetail();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation(["common", "detail"]);
  const [commentsData, setCommentData] = useState<Comments | undefined>(
    undefined,
  );
  const [pageParams, setPageParams] = useState(searchParams.get("page") || 1);

  const [reviewsData, setReviewsData] = useState<Comment[]>([]);

  // handle fetch comments data
  const fetchComments = async () => {
    if (!detailData?.id) return;
    const data = await getComments(detailData?.id, pageParams);
    return data;
  };

  // useQuery fetch comments data
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["comments"],
    queryFn: () => fetchComments(),
    enabled: false,
  });

  // refetch comments data when change page
  useEffect(() => {
    refetch();
  }, [refetch, pageParams]);

  // Set Comments data when data changes
  useEffect(() => {
    if (data) {
      setCommentData(data);
      if (!data.results?.length && data.reviewed?._id) {
        setReviewsData([data.reviewed]);
      }
    }
  }, [data]);

  // handle change pages
  const onChangePage = (page: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    page === 1
      ? searchParams.delete("page")
      : searchParams.set("page", page.toString());
    router.push(`?${searchParams.toString()}`, { scroll: false });
    setPageParams(page);
  };

  // delete review handler
  const handleDeleteReview = async (reviewId: string) => {
    if (!detailData?.id) return;
    await deleteReview(detailData?.id, reviewId);
    refetch();
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {t("detail:reviews")}{" "}
          {commentsData?.totalResults ? `(${commentsData?.totalResults})` : ""}
        </h2>
        {commentsData?.totalResults ? (
          <div className="flex flex-row gap-1 text-yellow-500">
            <span className="text-base">{rating}</span>
            <ShowRatingStar rating={rating} size="h-5 w-5" />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      {/* comment */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {reviewsData.length ? (
          reviewsData.map((comment, index) => (
            <div className="" key={index}>
              <CommentImageListing lang={i18n.language} data={comment} />
            </div>
          ))
        ) : (
          <div className="w-full text-center">
            {isLoading ? (
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
                      {/* <div className="_images grid grid-cols-3 gap-4">
                        <div className="col-span-1 h-2 rounded bg-slate-300"></div>
                        <div className="col-span-1 h-2 rounded bg-slate-300"></div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-xl font-medium">
                {t("detail:notHaveComments")}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="mx-auto mt-6">
        <CommonPagination
          onChangePage={onChangePage}
          paging={{
            currentPage: Number(pageParams),
            totalPages: Number(data?.totalPage ?? 0),
          }}
        />
      </div>
    </>
  );
};

export default BusinessReviews;
