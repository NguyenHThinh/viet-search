import { Comments, ReviewFormData } from "@/models/iCommentAndReview";
import API from "@/utils/api";

export const getComments = (businessId: string, page: string | number) =>
  API.get<Comments>(`/business/${businessId}/reviews`, {
    params: {
      page,
      limit: 10,
    },
  });

export const addReview = (businessId: string, reviewdata: ReviewFormData) =>
  API.post(`/business/${businessId}/reviews`, reviewdata);

export const updateReview = (
  businessId: string,
  reviewId: string,
  reviewdata: ReviewFormData,
) => API.patch(`/business/${businessId}/reviews/${reviewId}`, reviewdata);

export const deleteReview = (businessId: string, reviewId: string) =>
  API.delete(`/business/${businessId}/reviews/${reviewId}`);
