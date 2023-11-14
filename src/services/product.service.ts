/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RcFile } from "antd/es/upload";
import HttpInterceptor from "utils/HttpInterceptor";

export class ProductsService {
  public static async getProducts(page: number, limit: number) {
    const response = await HttpInterceptor.get("/products", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  }
  public static async createProduct({ ...body }): Promise<any> {
    const response = await HttpInterceptor.post(`/products`, {
      ...body,
    });
    return response.data;
  }
  public static async updateProduct(id: string, { ...body }): Promise<any> {
    const response = await HttpInterceptor.patch(`/products/${id}`, {
      ...body,
    });
    return response.data;
  }
  public static async getProductById(id: string): Promise<any> {
    const response = await HttpInterceptor.get(`/products/${id}`);
    return response.data;
  }
  public static async deleteProduct(ids: string[]): Promise<any> {
    const response = await HttpInterceptor.delete(`/products`, {
      data: {
        ids,
      },
    });

    return response;
  }

  public static async uploadProductImage(
    id: string,
    fileRc: RcFile
  ): Promise<any> {
    const formData = new FormData();
    // @ts-ignore
    formData.append("file", fileRc?.originFileObj);
    const response = await HttpInterceptor.post(
      `/product-images/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }
  public static async getProductImages(id: string): Promise<any> {
    const response = await HttpInterceptor.get(`/products-images/${id}`);
    return response.data;
  }
  public static async deleteProductImage(id: string): Promise<any> {
    const response = await HttpInterceptor.delete(`/products-images/${id}`);
    return response.data;
  }
}
