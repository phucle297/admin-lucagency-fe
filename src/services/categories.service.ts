/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpInterceptor from "utils/HttpInterceptor";

export class CategoriesService {
  public static async getCategories() {
    const response = await HttpInterceptor.get("/categories");
    return response;
  }
  public static async createCategory({ ...params }) {
    const response = await HttpInterceptor.post("/categories", { ...params });
    return response;
  }
  public static async updateCategory(id: string, { ...params }) {
    const response = await HttpInterceptor.patch(`/categories/${id}`, {
      ...params,
    });
    return response;
  }
  public static async deleteCategory(id: string) {
    const response = await HttpInterceptor.delete(`/categories/${id}`);
    return response;
  }
}
