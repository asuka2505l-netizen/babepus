import api from "./api/client";

export const authService = {
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data.data;
  },
  login: async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    return data.data;
  },
  me: async () => {
    const { data } = await api.get("/auth/me");
    return data.data.user;
  },
  requestEmailVerification: async () => {
    const { data } = await api.post("/auth/email-verification/request");
    return data.data.emailVerification;
  },
  verifyEmail: async (token) => {
    const { data } = await api.post("/auth/email-verification/verify", { token });
    return data.data.user;
  }
};
