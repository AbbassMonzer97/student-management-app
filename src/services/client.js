import axios from "axios";
const client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
client.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "An unexpected error occurred";
    const responseData = error.response?.data;
    if (
      responseData &&
      typeof responseData === "object" &&
      !Array.isArray(responseData)
    ) {
      errorMessage =
        responseData.message ||
        responseData.title ||
        error.message ||
        "An unexpected error occurred";
    } else if (responseData && typeof responseData === "string") {
      if (
        responseData.includes("<!DOCTYPE") ||
        responseData.includes("<html")
      ) {
        if (error.response?.status === 500) {
          errorMessage = "Internal server error";
        } else if (error.response?.status === 404) {
          errorMessage = "Service not found";
        } else if (
          error.response?.status === 503 ||
          error.response?.status === 502
        ) {
          errorMessage = "Service temporarily unavailable";
        } else {
          errorMessage = error.message || "An unexpected error occurred";
        }
      } else {
        errorMessage = responseData;
      }
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }
    if (import.meta.env.DEV) {
      console.error("[API Error]", errorMessage, error.response?.status);
    }
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);
export default client;
