import client from "./client";

export const getClasses = async () => {
  const response = await client.get("/api/Class");
  return response.data;
};

export const getClass = async (classId) => {
  const response = await client.get(`/api/Class/${classId}`);
  return response.data;
};
