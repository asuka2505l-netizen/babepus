import api from "./api/client";

export const userService = {
  getDashboard: async () => {
    const { data } = await api.get("/users/dashboard");
    return data.data;
  },
  getAnalytics: async () => {
    const { data } = await api.get("/users/analytics");
    return data.data.analytics;
  },
  updateProfile: async (payload) => {
    const { data } = await api.put("/users/profile", payload);
    return data.data.user;
  },
  uploadAvatar: async (formData) => {
    const { data } = await api.patch("/users/avatar", formData);
    return data.data.user;
  }
};
