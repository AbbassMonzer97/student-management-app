export const createStudentCreateUpdateDto = (formData) => ({
  firstName: formData.firstName || "",
  lastName: formData.lastName || "",
  email: formData.email || "",
  dateOfBirth: formData.dateOfBirth || "",
  classIds: formData.classIds || [],
});

export const createStudentListDto = (data) => ({
  id: data.id,
  firstName: data.firstName || "",
  lastName: data.lastName || "",
  email: data.email || "",
  dateOfBirth: data.dateOfBirth || "",
  classes: data.classes || [],
});
