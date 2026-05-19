import api from "./api/client";

export const categoryService = {
  getCategories: async () => {
    const { data } = await api.get("/categories");
    return data.data.categories;
  }
};
