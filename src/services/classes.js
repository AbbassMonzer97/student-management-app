export default client;

import client from "./client";
export const getClasses = async () => {
  const response = await client.get("/Class");
  return response.data;
};
export const getClass = async (classId) => {
  const response = await client.get(`/Class/${classId}`);
  return response.data;
};
