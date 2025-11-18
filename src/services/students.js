import client from "./client";
export const getStudents = async ({ page = 1, pageSize = 5 } = {}) => {
  const response = await client.get("/Student", {
    params: { page, pageSize },
  });
  return response.data;
};
export const getStudent = async (studentId) => {
  const response = await client.get(`/Student/${studentId}`);
  return response.data;
};
export const createStudent = async (studentData) => {
  const response = await client.post("/Student", studentData);
  return response.data;
};
export const updateStudent = async (studentId, studentData) => {
  const response = await client.put(`/Student/${studentId}`, studentData);
  return response.data;
};
export const deleteStudent = async (studentId) => {
  const response = await client.delete(`/Student/${studentId}`);
  return response.data;
};
