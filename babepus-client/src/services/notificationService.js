import api, { API_BASE_URL } from "./api/client";
import { tokenStorage } from "../utils/storage";

export const notificationService = {
  getNotifications: async () => {
    const { data } = await api.get("/notifications");
    return data.data;
  },
  markAsRead: async (id) => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data.data.notification;
  },
  markAllAsRead: async () => {
    const { data } = await api.patch("/notifications/read-all");
    return data.data;
  },
  createStream: () => {
    const token = tokenStorage.get();
    if (!token) {
      return null;
    }

    return new EventSource(`${API_BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`);
  }
};
