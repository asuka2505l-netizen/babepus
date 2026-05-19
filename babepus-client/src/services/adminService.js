import api from "./api/client";

export const adminService = {
  getDashboard: async () => {
    const { data } = await api.get("/admin/dashboard");
    return data.data.stats;
  },
  getUsers: async (params = {}) => {
    const { data } = await api.get("/admin/users", { params });
    return data.data.users;
  },
  suspendUser: async (id, isSuspended) => {
    const { data } = await api.patch(`/admin/users/${id}/suspend`, { isSuspended });
    return data.data.user;
  },
  getProducts: async () => {
    const { data } = await api.get("/admin/products");
    return data.data.products;
  },
  getReports: async () => {
    const { data } = await api.get("/admin/reports");
    return data.data.reports;
  },
  updateReportStatus: async (id, payload) => {
    const { data } = await api.patch(`/admin/reports/${id}/status`, payload);
    return data.data.report;
  }
};
