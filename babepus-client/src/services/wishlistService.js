import api from "./api/client";

export const wishlistService = {
  getWishlist: async () => {
    const { data } = await api.get("/wishlist");
    return data.data.products;
  },
  add: async (productId) => {
    const { data } = await api.post(`/wishlist/${productId}`);
    return data.data.wishlist;
  },
  remove: async (productId) => {
    const { data } = await api.delete(`/wishlist/${productId}`);
    return data.data.wishlist;
  }
};
