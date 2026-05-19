import api from "./api/client";

export const reportService = {
  createReport: async (payload) => {
    const { data } = await api.post("/reports", payload);
    return data.data.report;
  }
};
