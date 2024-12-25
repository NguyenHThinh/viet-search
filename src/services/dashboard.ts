import API from "@/utils/api";

export const getCreatedBusiness = (page: number, limit: number) =>
  API.get("/users/business/search", {
    params: {
      start: page <= 1 ? 0 : (page - 1) * limit,
      size: limit,
      sort_by: "created_at",
      order_by: "DESC",
    },
  });

export const getUserReviews = (page: number) =>
  API.get("/users/reviews", {
    params: {
      page,
      limit: 6,
    },
  });

export const getUpdatedImages = (page: number) =>
  API.get("/storage/upload-image", {
    params: {
      page,
      limit: 12,
    },
  });
