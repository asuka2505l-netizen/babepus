import api from "./api/client";

export const offerService = {
  createOffer: async (payload) => {
    const { data } = await api.post("/offers", payload);
    return data.data.offer;
  },
  getIncoming: async () => {
    const { data } = await api.get("/offers/incoming");
    return data.data.offers;
  },
  getMyOffers: async () => {
    const { data } = await api.get("/offers/my");
    return data.data.offers;
  },
  accept: async (id) => {
    const { data } = await api.patch(`/offers/${id}/accept`);
    return data.data;
  },
  reject: async (id) => {
    const { data } = await api.patch(`/offers/${id}/reject`);
    return data.data.offer;
  }
};
