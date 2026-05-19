import api from "./api/client";
import { compactParams } from "../utils/query";

export const productService = {
  getProducts: async (params) => {
    const { data } = await api.get("/products", { params: compactParams(params) });
    return { products: data.data.products, meta: data.meta };
  },
  searchProducts: async (params) => {
    const { data } = await api.get("/products/search", { params: compactParams(params) });
    return { products: data.data.products, meta: data.meta };
  },
  getProduct: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data.data.product;
  },
  getMyProducts: async () => {
    const { data } = await api.get("/products/mine");
    return data.data.products;
  },
  createProduct: async (formData) => {
    const { data } = await api.post("/products", formData);
    return data.data.product;
  },
  updateProduct: async (id, formData) => {
    const { data } = await api.put(`/products/${id}`, formData);
    return data.data.product;
  },
  deleteProduct: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data.data.product;
  },
  markSold: async (id) => {
    const { data } = await api.patch(`/products/${id}/sold`);
    return data.data.product;
  }
};
