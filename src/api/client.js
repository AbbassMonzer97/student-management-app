import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`
      );
    }
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

    // Check if response data is an object (JSON) or HTML string
    const responseData = error.response?.data;

    if (
      responseData &&
      typeof responseData === "object" &&
      !Array.isArray(responseData)
    ) {
      // JSON response
      errorMessage =
        responseData.message ||
        responseData.title ||
        error.message ||
        "An unexpected error occurred";
    } else if (responseData && typeof responseData === "string") {
      // HTML or plain text response
      if (
        responseData.includes("<!DOCTYPE") ||
        responseData.includes("<html")
      ) {
        // HTML error page - use status-based message
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
        // Plain text response
        errorMessage = responseData;
      }
    } else {
      // No response data or other format
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
