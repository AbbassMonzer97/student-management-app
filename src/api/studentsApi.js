import client from "./client";

export const getStudents = async ({ page = 1, pageSize = 5 } = {}) => {
  const response = await client.get("/api/Student", {
    params: { page, pageSize },
  });
  return response.data;
};

export const getStudent = async (studentId) => {
  const response = await client.get(`/api/Student/${studentId}`);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await client.post("/api/Student", studentData);
  return response.data;
};

export const updateStudent = async (studentId, studentData) => {
  const response = await client.put(`/api/Student/${studentId}`, studentData);
  return response.data;
};

export const deleteStudent = async (studentId) => {
  const response = await client.delete(`/api/Student/${studentId}`);
  return response.data;
};
