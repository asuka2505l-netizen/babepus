import api, { API_BASE_URL } from "./api/client";
import { tokenStorage } from "../utils/storage";

export const chatService = {
  getConversations: async () => {
    const { data } = await api.get("/chat/conversations");
    return data.data.conversations;
  },
  startConversation: async (payload) => {
    const { data } = await api.post("/chat/conversations", payload);
    return data.data;
  },
  getMessages: async (conversationId) => {
    const { data } = await api.get(`/chat/conversations/${conversationId}/messages`);
    return data.data.messages;
  },
  sendMessage: async (conversationId, message) => {
    const { data } = await api.post(`/chat/conversations/${conversationId}/messages`, { message });
    return data.data.message;
  },
  createStream: () => {
    const token = tokenStorage.get();
    if (!token) {
      return null;
    }

    return new EventSource(`${API_BASE_URL}/chat/stream?token=${encodeURIComponent(token)}`);
  }
};
