import api from "./api/client";

export const reviewService = {
  createReview: async (payload) => {
    const { data } = await api.post("/reviews", payload);
    return data.data.review;
  }
};
