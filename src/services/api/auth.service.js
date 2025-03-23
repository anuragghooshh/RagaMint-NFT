import { apiError, responseValidator } from "./helper";

export const uploadImage = async (payload) => {
  const formData = new FormData();
  formData.append("file", payload);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    return await responseValidator(res, true);
  } catch (error) {
    apiError(error);
  }
};
