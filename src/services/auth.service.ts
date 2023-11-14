/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpInterceptor from "utils/HttpInterceptor";

export class AuthService {
  public static async login({ ...params }) {
    const response = await HttpInterceptor.post("/auth/login", { ...params });
    return response;
  }
  public static logout() {
    localStorage.removeItem("token");
    const response = HttpInterceptor.post("/auth/logout");
    return response;
  }
  public static whoAmI() {
    const response = HttpInterceptor.get("/auth/who-am-i");
    return response;
  }
}
