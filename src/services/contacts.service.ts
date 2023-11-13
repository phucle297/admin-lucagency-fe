/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpInterceptor from "utils/HttpInterceptor";

export class ContactsService {
  public static async getContacts() {
    const response = await HttpInterceptor.get("/contacts");
    return response.data;
  }
  public static async updateContacts(contactId: string, values: any[]) {
    const response = await HttpInterceptor.patch(`/contacts/${contactId}`, {
      values,
    });
    return response.data;
  }
}
