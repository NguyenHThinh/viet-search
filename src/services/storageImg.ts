import API from "@/utils/api";
import { AxiosProgressEvent } from "axios";

export const uploadImages = (formData: FormData) =>
  API.post("/storage/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const uploadFiles = (
  formData: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  return API.post("/storage/upload/files-claim", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};
