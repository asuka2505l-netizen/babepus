import api from "./api/client";

export const pricingService = {
  estimate: async (payload) => {
    const { data } = await api.post("/pricing/estimate", payload);
    return data.data.estimate;
  }
};
