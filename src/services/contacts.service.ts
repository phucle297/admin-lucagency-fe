/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpInterceptor from "utils/HttpInterceptor";

export class ContactsService {
  public static async getContacts() {
    const response = await HttpInterceptor.get("/contacts");
    return response;
  }
  public static async updateContacts(
    contactId: string,
    { ...params }
  ): Promise<any> {
    const response = await HttpInterceptor.patch(`/contacts/${contactId}`, {
      ...params,
    });
    return response.data;
  }
}
