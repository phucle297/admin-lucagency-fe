/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";

const DEFAULT_CONFIG_AXIOS = {
  baseURL: import.meta.env.VITE_BASE_URL_API,
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: "Bearer " + localStorage.getItem("token") || "",
  },
};

function getAxiosInstance() {
  const instance = axios.create(DEFAULT_CONFIG_AXIOS);
  instance.interceptors.request.use((config) => {
    return config;
  });
  instance.interceptors.response.use(
    function (response) {
      return response.data;
    },
    function (error) {
      const response = error.response;
      // @ts-ignore
      const errorMessage = response?.data?.errors?.join(",");
      const code = response?.data?.code;
      const statusCode = response?.data?.statusCode || response?.status;

      if (
        (errorMessage === "invalid token" || statusCode === 401) &&
        location.pathname !== "/login"
      ) {
        window.location.href = "/login";
        console.log(`Redirect to login page`);
      }

      throw { message: errorMessage, statusCode: statusCode, code };
    }
  );

  return instance;
}

const HttpInterceptor = getAxiosInstance();

export default HttpInterceptor;
export { getAxiosInstance };
