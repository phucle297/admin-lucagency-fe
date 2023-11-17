/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RcFile } from "antd/es/upload";
import HttpInterceptor from "utils/HttpInterceptor";

export class ProductsService {
  public static async getProducts(page?: number, limit?: number) {
    const response = await HttpInterceptor.get("/products", {
      params: {
        page,
        limit,
      },
    });
    return response;
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
    return response;
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
    if (fileRc?.originFileObj) formData.append("file", fileRc?.originFileObj);
    else {
      formData.append("file", fileRc);
    }
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
    const response = await HttpInterceptor.get(`/product-images/${id}`);
    return response.data;
  }
  public static async deleteProductImage(id: string): Promise<any> {
    const response = await HttpInterceptor.delete(`/product-images/${id}`);
    return response.data;
  }
}
