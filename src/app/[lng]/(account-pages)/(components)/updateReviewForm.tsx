"use client";

import { useTranslation } from "@/app/i18n/client";
import { useAuthContext } from "@/auth/useAuthContext";
import AppImage from "@/components/AppImage";
import RatingStar from "@/components/RatingStar";
import UploadImage from "@/components/uploadImages/UploadImage";
import { Comment, ReviewFormData } from "@/models/iCommentAndReview";
import { updateReview } from "@/services/reviews";
import Textarea from "@/shared/Textarea";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { FC, FormEvent, Fragment, useEffect, useState } from "react";

interface UpdateReviewFormProps {
  data: Comment;
  isOpenForm: boolean;
  onCloseForm: () => void;
}

const UpdateReviewForm: FC<UpdateReviewFormProps> = ({
  data,
  isOpenForm,
  onCloseForm,
}) => {
  const { isAuthenticated } = useAuthContext();
  const { t } = useTranslation(["detail", "common"]);

  //
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [reviewFormData, setReviewFormData] = useState<ReviewFormData>({
    rating: data?.rating ?? 0,
    comment: data?.comment ?? "",
    images: data?.images ?? [],
  });

  useEffect(() => {
    setReviewFormData({
      rating: data?.rating ?? 0,
      comment: data?.comment ?? "",
      images: data?.images ?? [],
    });
  }, [data]);

  // handle close review form
  const handleCloseUpdateReviewForm = () => {
    onCloseForm();
    setReviewError("");
  };

  // update review with data
  const updateComment = useMutation({
    mutationFn: async (newReview: ReviewFormData) => {
      const response = await updateReview(
        data.business._id,
        data._id,
        newReview,
      );
      return response.data;
    },
    //success reset form input and error
    onSuccess: () => {
      onCloseForm();
      setReviewError(null);
    },
    // show error
    onError: (error: any) => {
      setReviewError(
        error?.message || "An error occurred while submitting your review.",
      );
    },
  });

  const handleUpdateReview = (e: FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      updateComment.mutate(reviewFormData);
      return;
    }
    setReviewError(t("detail:requestLogin"));
  };

  const handleSetStar = (star: number) => {
    setReviewFormData((prev) => ({
      ...prev,
      rating: star,
    }));
  };

  return (
    <Transition appear show={isOpenForm} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0  z-50 flex w-full items-center justify-center"
        onClose={handleCloseUpdateReviewForm}
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
        <span className="inline-block h-screen align-middle" aria-hidden="true">
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
                  <div className="flex items-center justify-between rounded-t-md bg-gray-100 px-4 py-5 dark:bg-neutral-800 dark:text-neutral-200 md:px-8 md:py-4">
                    {/* header title form */}
                    <div className="flex flex-row items-center gap-2">
                      <div className="relative h-14 w-14">
                        <AppImage
                          src={data.business.thumbnail}
                          alt=""
                          fill
                          className="rounded-lg bg-white object-cover"
                        />
                      </div>
                      <p className="line-clamp-1 text-base font-semibold">
                        {data.business.name}
                      </p>
                    </div>
                    <button
                      onClick={handleCloseUpdateReviewForm}
                      className="focus:outline-none"
                    >
                      <XMarkIcon className="h-7 w-7 text-gray-400" />
                    </button>
                  </div>
                  <form className="max-h-[20%] overflow-y-auto px-4 pb-7 pt-6 md:px-10 md:pb-4 md:pt-12">
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
                      <p className="font-medium text-red-500">{reviewError}</p>
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
                        onClick={handleCloseUpdateReviewForm}
                        className="rounded bg-gray-400 px-6 py-3 text-sm text-white shadow transition-colors hover:bg-gray-500 hover:text-opacity-100 dark:text-neutral-200"
                      >
                        {t("common:cancel")}
                      </button>
                      {data.rating === 0 ? (
                        <div></div>
                      ) : (
                        <button
                          onClick={handleUpdateReview}
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
  );
};

export default UpdateReviewForm;
