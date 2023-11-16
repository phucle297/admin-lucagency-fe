/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpInterceptor from "utils/HttpInterceptor";

export class CustomersService {
  public static async getCustomers({ ...params }) {
    const response = await HttpInterceptor.get("/customers", {
      params: { ...params },
    });
    return response;
  }
  public static async deleteCustomers(ids: string[]): Promise<any> {
    const response = await HttpInterceptor.delete(`/customers`, {
      data: {
        ids,
      },
    });

    return response;
  }
  public static async getCustomerById(customerId: string): Promise<any> {
    const response = await HttpInterceptor.get(`/customers/${customerId}`);
    return response;
  }
  public static async updateStatusToCompleted(
    customerId: string
  ): Promise<any> {
    const response = await HttpInterceptor.patch(`/customers/${customerId}`);
    return response;
  }
}
