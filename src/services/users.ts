import { UserFormSchema } from "@/app/[lng]/(account-pages)/account/page";
import API from "@/utils/api";

export const getUserProfile = () => API.get("/users/profile");

export const updateUserInfo = (data: UserFormSchema) =>
  API.patch("/users/profile", data);
