import api from "./api/client";

export const transactionService = {
  getMyTransactions: async () => {
    const { data } = await api.get("/transactions/my");
    return data.data.transactions;
  },
  complete: async (id) => {
    const { data } = await api.patch(`/transactions/${id}/complete`);
    return data.data.transaction;
  },
  buyerConfirm: async (id) => {
    const { data } = await api.patch(`/transactions/${id}/escrow/buyer-confirm`);
    return data.data.transaction;
  },
  sellerConfirm: async (id) => {
    const { data } = await api.patch(`/transactions/${id}/escrow/seller-confirm`);
    return data.data.transaction;
  },
  dispute: async (id, note) => {
    const { data } = await api.patch(`/transactions/${id}/escrow/dispute`, { note });
    return data.data.transaction;
  }
};
