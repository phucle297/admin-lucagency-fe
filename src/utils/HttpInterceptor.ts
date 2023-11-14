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
      const errorMessage = response?.data?.message;
      const statusCode = response?.data?.statusCode || response?.status;

      if (errorMessage === "invalid token" || statusCode === 401) {
        const loginUrl = "/login";
        console.log(`Redirect to ${loginUrl}`);
      }

      throw { message: errorMessage, statusCode: statusCode };
    }
  );

  return instance;
}

const HttpInterceptor = getAxiosInstance();

export default HttpInterceptor;
export { getAxiosInstance };
