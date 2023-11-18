/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpInterceptor from "utils/HttpInterceptor";

export class UsersService {
  public static async createUsers({ ...params }) {
    const response = await HttpInterceptor.post("/users", { ...params });
    return response;
  }
  public static async getUsers(
    page: number,
    limit: number,
    search: string,
    role?: string
  ) {
    const response = await HttpInterceptor.get("/users", {
      params: { page, limit, search, role },
    });
    return response;
  }
  public static async deleteUsers(ids: string[]): Promise<any> {
    const response = await HttpInterceptor.delete(`/users`, {
      data: {
        ids,
      },
    });

    return response;
  }
  public static async getUserById(userId: string): Promise<any> {
    const response = await HttpInterceptor.get(`/users/${userId}`);
    return response;
  }
  public static async updateUser(userId: string, { ...params }): Promise<any> {
    const response = await HttpInterceptor.patch(`/users/${userId}`, {
      ...params,
    });
    return response;
  }
}
