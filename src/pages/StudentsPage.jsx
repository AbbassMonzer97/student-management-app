import { useState, useEffect, useCallback } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/students";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import Toast from "../components/Toast";

const StudentsPage = () => {
  const [dataState, setDataState] = useState({
    students: [],
    allStudents: [],
    error: null,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  const [loading, setLoading] = useState({
    isLoading: true,
    isSubmitting: false,
    isDeleting: false,
  });

  const [uiState, setUiState] = useState({
    isFormOpen: false,
    isDeleteDialogOpen: false,
    editingStudent: null,
    deletingStudent: null,
  });

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  const pageSize = 5;

  const showToast = useCallback((message, type = "info") => {
    setToast({ isVisible: true, message, type });
  }, []);

  const fetchAllStudents = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isLoading: true }));
    setDataState((prev) => ({ ...prev, error: null }));
    try {
      const response = await getStudents({ page: 1, pageSize: 1000 });

      let allStudentsData = [];

      if (Array.isArray(response)) {
        allStudentsData = response;
      } else if (response.items || response.data) {
        allStudentsData = response.items || response.data || [];
      } else if (response.students) {
        allStudentsData = response.students;
      } else {
        const keys = Object.keys(response);
        const arrayKey = keys.find((key) => Array.isArray(response[key]));
        if (arrayKey) {
          allStudentsData = response[arrayKey];
        }
      }

      const totalCount = allStudentsData.length;
      const totalPages = Math.ceil(totalCount / pageSize) || 1;

      setDataState((prev) => ({ ...prev, allStudents: allStudentsData }));
      setPagination((prev) => ({ ...prev, totalCount, totalPages }));

      return allStudentsData;
    } catch (err) {
      console.error("Failed to fetch students:", err);
      const errorMessage =
        err.message || "Failed to load students. Please try again.";
      setDataState((prev) => ({ ...prev, error: errorMessage }));
      showToast("Failed to load students. Please try again.", "error");
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, isLoading: false }));
    }
  }, [pageSize, showToast]);

  const paginateStudents = useCallback(
    (studentsList, page = 1) => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedStudents = studentsList.slice(startIndex, endIndex);
      setDataState((prev) => ({ ...prev, students: paginatedStudents }));
      setPagination((prev) => ({ ...prev, currentPage: page }));
    },
    [pageSize]
  );

  const fetchStudents = useCallback(
    async (page = 1, forceRefresh = false) => {
      if (!forceRefresh && dataState.allStudents.length > 0) {
        paginateStudents(dataState.allStudents, page);
        return;
      }

      const fetchedStudents = await fetchAllStudents();

      if (fetchedStudents.length > 0) {
        paginateStudents(fetchedStudents, page);
      }
    },
    [dataState.allStudents, fetchAllStudents, paginateStudents]
  );

  useEffect(() => {
    fetchStudents(pagination.currentPage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = useCallback(
    (newPage) => {
      fetchStudents(newPage);
    },
    [fetchStudents]
  );

  const handleAddClick = useCallback(() => {
    setUiState({
      isFormOpen: true,
      isDeleteDialogOpen: false,
      editingStudent: null,
      deletingStudent: null,
    });
  }, []);

  const handleEditClick = useCallback((student) => {
    setUiState((prev) => ({
      ...prev,
      editingStudent: student,
      isFormOpen: true,
    }));
  }, []);

  const handleDeleteClick = useCallback((student) => {
    setUiState((prev) => ({
      ...prev,
      deletingStudent: student,
      isDeleteDialogOpen: true,
    }));
  }, []);

  const handleFormSubmit = useCallback(
    async (formData) => {
      setLoading((prev) => ({ ...prev, isSubmitting: true }));
      try {
        const wasEditing = !!uiState.editingStudent;

        if (uiState.editingStudent) {
          await updateStudent(uiState.editingStudent.id, formData);
          showToast("Student updated successfully!", "success");
        } else {
          await createStudent(formData);
          showToast("Student created successfully!", "success");
        }

        setUiState((prev) => ({
          ...prev,
          isFormOpen: false,
          editingStudent: null,
        }));

        const updatedStudents = await fetchAllStudents();
        if (wasEditing) {
          paginateStudents(updatedStudents, pagination.currentPage);
        } else {
          setPagination((prev) => ({ ...prev, currentPage: 1 }));
          paginateStudents(updatedStudents, 1);
        }
      } catch (err) {
        console.error("Failed to save student:", err);
        showToast(
          err.message || "Failed to save student. Please try again.",
          "error"
        );
      } finally {
        setLoading((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [
      uiState.editingStudent,
      pagination.currentPage,
      fetchAllStudents,
      paginateStudents,
      showToast,
    ]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!uiState.deletingStudent) return;

    setLoading((prev) => ({ ...prev, isDeleting: true }));
    try {
      await deleteStudent(uiState.deletingStudent.id);
      showToast("Student deleted successfully!", "success");
      setUiState((prev) => ({
        ...prev,
        isDeleteDialogOpen: false,
        deletingStudent: null,
      }));

      const updatedStudents = await fetchAllStudents();

      const remainingCount = updatedStudents.length;
      const newTotalPages = Math.ceil(remainingCount / pageSize);
      if (pagination.currentPage > newTotalPages && newTotalPages > 0) {
        paginateStudents(updatedStudents, newTotalPages);
      } else {
        paginateStudents(updatedStudents, pagination.currentPage);
      }
    } catch (err) {
      console.error("Failed to delete student:", err);
      showToast(
        err.message || "Failed to delete student. Please try again.",
        "error"
      );
    } finally {
      setLoading((prev) => ({ ...prev, isDeleting: false }));
    }
  }, [
    uiState.deletingStudent,
    pagination.currentPage,
    pageSize,
    fetchAllStudents,
    paginateStudents,
    showToast,
  ]);

  const handleRetry = useCallback(() => {
    fetchStudents(pagination.currentPage);
  }, [fetchStudents, pagination.currentPage]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
        <p className="text-gray-600">Manage students and their classes</p>
      </div>

      {dataState.error && !loading.isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading students
              </h3>
              <p className="text-sm text-red-600 mt-1">{dataState.error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          + Add Student
        </button>
      </div>

      <StudentTable
        students={dataState.students}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        isLoading={loading.isLoading}
      />

      {!loading.isLoading && dataState.students.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          isLoading={loading.isLoading}
        />
      )}

      <StudentForm
        isOpen={uiState.isFormOpen}
        student={uiState.editingStudent}
        onClose={() => {
          setUiState((prev) => ({
            ...prev,
            isFormOpen: false,
            editingStudent: null,
          }));
        }}
        onSubmit={handleFormSubmit}
        isLoading={loading.isSubmitting}
      />

      <ConfirmDialog
        isOpen={uiState.isDeleteDialogOpen}
        title="Delete Student"
        message={`Are you sure you want to delete ${
          uiState.deletingStudent
            ? uiState.deletingStudent.name ||
              `${uiState.deletingStudent.firstName || ""} ${
                uiState.deletingStudent.lastName || ""
              }`.trim() ||
              "this student"
            : "this student"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setUiState((prev) => ({
            ...prev,
            isDeleteDialogOpen: false,
            deletingStudent: null,
          }));
        }}
        isLoading={loading.isDeleting}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default StudentsPage;
