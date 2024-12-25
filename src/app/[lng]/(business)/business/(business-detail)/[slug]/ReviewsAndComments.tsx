"use client";

import { useTranslation } from "@/app/i18n/client";
import { useAuthContext } from "@/auth/useAuthContext";
import CommentImageListing from "@/components/CommentImageListing";
import CommentImageListingDashboard from "@/components/CommentImageListingDashboard";
import RatingStar from "@/components/RatingStar";
import ShowRatingStar from "@/components/ShowRatingStar";
import UploadImage from "@/components/uploadImages/UploadImage";
import { Comments, ReviewFormData } from "@/models/iCommentAndReview";
import {
  addReview,
  deleteReview,
  getComments,
  updateReview,
} from "@/services/reviews";
import CommonPagination from "@/shared/CommonPagination";
import Textarea from "@/shared/Textarea";
import { Dialog, Transition } from "@headlessui/react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, FormEvent, Fragment, useEffect, useState } from "react";
import OverRating from "./OverRating";
import { IBusinessRating } from "@/models/iBusiness";

interface ReviewsAndCommentsProps {
  businessId: string;
  overRating: IBusinessRating;
}

const ReviewsAndComments: FC<ReviewsAndCommentsProps> = ({
  businessId,
  overRating,
}) => {
  const { isAuthenticated } = useAuthContext();

  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation(["common", "detail"]);
  const [isOpenReview, setIsOpenReview] = useState(false);
  const [commentsData, setCommentData] = useState<Comments | undefined>(
    undefined,
  );
  const [reviewFormData, setReviewFormData] = useState<ReviewFormData>({
    rating: Number(commentsData?.reviewed?.rating ?? 0),
    comment: commentsData?.reviewed?.comment ?? "",
    images: commentsData?.reviewed?.images ?? [],
  });
  const [pageParams, setPageParams] = useState(searchParams.get("page") || 1);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // handle close review form
  const handleCloseReviewForm = () => {
    setIsOpenReview(false);
    setReviewError("");
    setReviewFormData({
      rating: Number(commentsData?.reviewed?.rating ?? 0),
      comment: commentsData?.reviewed?.comment ?? "",
      images: commentsData?.reviewed?.images ?? [],
    });
  };

  // handle fetch comments data
  const fetchComments = async () => {
    const data = await getComments(businessId, pageParams);
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

  // set Comments data
  useEffect(() => {
    setCommentData(data);
  }, [data]);

  // set rating star
  const handleSetStar = (star: number) => {
    setReviewFormData((prev) => ({
      ...prev,
      rating: star,
    }));
  };

  // handle change pages
  const onChangePage = (page: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    page === 1
      ? searchParams.delete("page")
      : searchParams.set("page", page.toString());
    router.push(`?${searchParams.toString()}`, { scroll: false });
    setPageParams(page);
  };

  // Post review with data
  const postComment = useMutation({
    mutationFn: async (newReview: ReviewFormData) => {
      const response = await addReview(businessId, newReview);
      return response.data;
    },
    //success reset form input and error
    onSuccess: () => {
      setReviewFormData({
        rating: 0,
        comment: "",
        images: [],
      });
      setIsOpenReview(false);
      setReviewError(null);
      refetch();
    },
    // show error
    onError: (error: any) => {
      setReviewError(
        error?.message || "An error occurred while submitting your review.",
      );
    },
  });

  // update review with data
  const updateComment = useMutation({
    mutationFn: async (newReview: ReviewFormData) => {
      const response = await updateReview(
        businessId,
        commentsData?.reviewed?._id ?? "",
        newReview,
      );
      return response.data;
    },
    //success reset form input and error
    onSuccess: () => {
      setReviewFormData({
        rating: 0,
        comment: "",
        images: [],
      });
      setIsOpenReview(false);
      setReviewError(null);
      refetch();
    },
    // show error
    onError: (error: any) => {
      setReviewError(
        error?.message || "An error occurred while submitting your review.",
      );
    },
  });

  // Submit review handler
  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    // check user had rating or not
    if (isAuthenticated) {
      // check had reviewed
      if (commentsData?.reviewed?._id) {
        updateComment.mutate(reviewFormData);
        refetch();
        return;
      }
      postComment.mutate(reviewFormData);
      refetch();
      return;
    }
    setReviewError(t("detail:requestLogin"));
  };

  // handle update review button
  const openUpdateReview = () => {
    setReviewFormData({
      rating: Number(commentsData?.reviewed?.rating.toFixed(1) ?? 0),
      comment: commentsData?.reviewed?.comment ?? "",
      images: commentsData?.reviewed?.images ?? [],
    });
    setIsOpenReview(true);
  };

  // delete review handler
  const handleDeleteReview = async (_: any, reviewId: string) => {
    await deleteReview(businessId, reviewId);
    refetch();
  };

  return (
    <div className="listingSection__wrap" id="reviews">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold">{t("detail:reviews")} </h2>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      {commentsData?.reviewed?._id && (
        <CommentImageListingDashboard
          onDelete={handleDeleteReview}
          data={commentsData.reviewed}
          lang={i18n.language}
        />
      )}

      {/* button open review form */}
      <button
        onClick={() => {
          commentsData?.reviewed?._id
            ? openUpdateReview()
            : setIsOpenReview(true);
        }}
        className="group inline-flex items-center gap-2 self-center rounded-full border-2 border-blue-300 px-10 py-2 font-medium hover:border-blue-400 hover:shadow-md dark:border-blue-400 dark:hover:bg-neutral-800"
      >
        <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
        <span>
          {commentsData?.reviewed?._id
            ? t("detail:updateReview")
            : t("detail:createReview")}
        </span>
      </button>

      <Transition appear show={isOpenReview} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0  z-50 flex w-full items-center justify-center"
          onClose={handleCloseReviewForm}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 z-0 h-full w-full bg-gray-900 opacity-40" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                {/* Content */}
                <Dialog.Panel className="fixed max-h-screen w-11/12 overflow-y-auto rounded-md bg-white shadow dark:bg-neutral-700 dark:text-neutral-200 sm:h-auto md:w-8/12 lg:mt-10 xl:w-1/2 2xl:w-2/5">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between rounded-t-md bg-gray-100 px-4 py-7 dark:bg-neutral-800 dark:text-neutral-200 md:px-8 md:py-4">
                      <p className="text-base font-semibold ">
                        {t("detail:writeReview")}
                      </p>
                      <button
                        onClick={handleCloseReviewForm}
                        className="focus:outline-none"
                      >
                        <XMarkIcon className="h-7 w-7 text-gray-400" />
                      </button>
                    </div>
                    <form className="px-4 pb-7 pt-6 md:px-10 md:pb-4 md:pt-12">
                      <div className="flex">
                        <RatingStar
                          defaultPoint={reviewFormData?.rating}
                          iconClass="w-6 h-6"
                          className="w-max cursor-pointer space-x-0.5"
                          setStar={handleSetStar}
                        />
                        <span className="ml-4 text-gray-500 dark:text-neutral-200">
                          {t("detail:selectRating")}
                        </span>
                      </div>
                      <div className="relative mt-11">
                        <Textarea
                          className="border-primary-mainx h-24 w-full resize-none overflow-y-auto rounded border  py-3 pl-3 focus:outline-none"
                          placeholder={t("detail:placeHolderReview")}
                          value={reviewFormData?.comment ?? ""}
                          onChange={(e) => {
                            setReviewFormData((prev) => ({
                              ...prev,
                              comment: e.target.value,
                            }));
                          }}
                          onClick={() => setReviewError("")}
                        />
                      </div>
                      {reviewError && (
                        <p className="font-medium text-red-500">
                          {reviewError}
                        </p>
                      )}
                      <p className="pb-2 pt-3 text-left text-sm font-semibold">
                        {t("detail:addImages")}
                      </p>
                      <UploadImage
                        isMultiple
                        setReviewFormData={setReviewFormData}
                        reviewFormData={reviewFormData}
                      />
                      <div className="mt-9 flex items-center justify-between">
                        <button
                          onClick={handleCloseReviewForm}
                          className="rounded bg-gray-400 px-6 py-3 text-sm text-white shadow transition-colors hover:bg-gray-500 hover:text-opacity-100 dark:text-neutral-200"
                        >
                          {t("common:cancel")}
                        </button>
                        {reviewFormData.rating === 0 ? (
                          <div></div>
                        ) : (
                          <button
                            onClick={handleSubmitReview}
                            className="rounded bg-primary-500 px-6 py-3 text-sm text-white shadow transition-colors hover:bg-opacity-80 hover:text-opacity-100 dark:text-neutral-200"
                          >
                            {t("detail:submit")}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {overRating && (
        <>
          <div className="w-full border-b border-neutral-300 dark:border-neutral-700"></div>
          <OverRating overRating={overRating} />
        </>
      )}
      <div className="w-full border-b border-neutral-300 dark:border-neutral-700"></div>

      {/* comment */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {commentsData?.results?.length ? (
          commentsData?.results?.map((comment, index) => (
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
    </div>
  );
};

export default ReviewsAndComments;
