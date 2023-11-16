/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpInterceptor from "utils/HttpInterceptor";

export class InvoiceService {
  public static async createInvoice({ ...params }) {
    const response = await HttpInterceptor.post("/invoices", { ...params });
    return response;
  }
  public static async getInvoices(page: number, limit: number) {
    const response = await HttpInterceptor.get("/invoices", {
      params: { page, limit },
    });
    return response;
  }
  public static async deleteInvoices(ids: string[]): Promise<any> {
    const response = await HttpInterceptor.delete(`/invoices`, {
      data: {
        ids,
      },
    });

    return response;
  }
  public static async getInvoiceById(invoiceId: string): Promise<any> {
    const response = await HttpInterceptor.get(`/invoices/${invoiceId}`);
    return response;
  }
  public static async updateInvoice(
    invoiceId: string,
    { ...params }
  ): Promise<any> {
    const response = await HttpInterceptor.patch(`/invoices/${invoiceId}`, {
      ...params,
    });
    return response;
  }
}
