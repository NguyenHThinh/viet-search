import { IBusiness } from "@/models/iBusiness";
import API from "@/utils/api";

export const addWishList = async (businessId: string) =>
  await API.post("/wishlist", {
    businessId,
  });

export const deleteWishList = async (businessId: string) =>
  await API.delete(`/wishlist/${businessId}`);

export const getWishlist = async (page: number, type: string) =>
  await API.get<{ results: IBusiness[]; totalPages: number }>(`/wishlist`, {
    params: {
      type,
      limit: 12,
      page,
    },
  });
