import { apiError, getAuthToken, responseValidator } from "./helper";

export const createNFt = async (payload) => {
  try {
    const res = await fetch("/api/nfts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });
    return await responseValidator(res, true);
  } catch (error) {
    apiError(error);
  }
};

export const getUserNFTs = async () => {
  try {
    const res = await fetch("/api/nfts/getAll", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });

    return await responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};
