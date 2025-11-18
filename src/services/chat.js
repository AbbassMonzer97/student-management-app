import client from "./client";

const BASE_URL = import.meta.env.VITE_CHATBOT_API;

export const sendChatMessage = async (message) => {
  try {
    const response = await client.post(`${BASE_URL}`, { message });
    return response.data;
  } catch (error) {
    if (error.status === 404) {
      try {
        const response = await client.post(`${BASE_URL}`, { message });
        return response.data;
      } catch (err) {
        const response = await client.post(`${BASE_URL}`, {
          message,
        });
        return response.data;
      }
    }
    throw error;
  }
};
