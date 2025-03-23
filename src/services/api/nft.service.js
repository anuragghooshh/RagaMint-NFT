import { apiError, responseValidator } from "./helper";

export const createNFt = async (payload) => {
  try {
    const res = await fetch("/api/nfts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await responseValidator(res, true);
  } catch (error) {
    apiError(error);
  }
};
