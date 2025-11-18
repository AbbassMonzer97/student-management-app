import { useState, useEffect } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/studentsApi";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import Toast from "../components/Toast";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  const pageSize = 5;

  const fetchAllStudents = async () => {
    setIsLoading(true);
    setError(null);
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

      setAllStudents(allStudentsData);
      setTotalCount(allStudentsData.length);
      setTotalPages(Math.ceil(allStudentsData.length / pageSize) || 1);

      return allStudentsData;
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError(err.message || "Failed to load students. Please try again.");
      showToast("Failed to load students. Please try again.", "error");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const paginateStudents = (studentsList, page = 1) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedStudents = studentsList.slice(startIndex, endIndex);
    setStudents(paginatedStudents);
    setCurrentPage(page);
  };

  const fetchStudents = async (page = 1, forceRefresh = false) => {
    if (!forceRefresh && allStudents.length > 0) {
      paginateStudents(allStudents, page);
      return;
    }

    const fetchedStudents = await fetchAllStudents();

    if (fetchedStudents.length > 0) {
      paginateStudents(fetchedStudents, page);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ isVisible: true, message, type });
  };

  const handlePageChange = (newPage) => {
    fetchStudents(newPage);
  };

  const handleAddClick = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (student) => {
    setDeletingStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const wasEditing = !!editingStudent;

      if (editingStudent) {
        await updateStudent(editingStudent.id, formData);
        showToast("Student updated successfully!", "success");
      } else {
        await createStudent(formData);
        showToast("Student created successfully!", "success");
      }

      setIsFormOpen(false);
      setEditingStudent(null);

      const updatedStudents = await fetchAllStudents();
      if (wasEditing) {
        paginateStudents(updatedStudents, currentPage);
      } else {
        setCurrentPage(1);
        paginateStudents(updatedStudents, 1);
      }
    } catch (err) {
      console.error("Failed to save student:", err);
      showToast(
        err.message || "Failed to save student. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;

    setIsDeleting(true);
    try {
      await deleteStudent(deletingStudent.id);
      showToast("Student deleted successfully!", "success");
      setIsDeleteDialogOpen(false);
      setDeletingStudent(null);

      const updatedStudents = await fetchAllStudents();

      const remainingCount = updatedStudents.length;
      const newTotalPages = Math.ceil(remainingCount / pageSize);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        paginateStudents(updatedStudents, newTotalPages);
      } else {
        paginateStudents(updatedStudents, currentPage);
      }
    } catch (err) {
      console.error("Failed to delete student:", err);
      showToast(
        err.message || "Failed to delete student. Please try again.",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRetry = () => {
    fetchStudents(currentPage);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
        <p className="text-gray-600">Manage students and their classes</p>
      </div>

      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading students
              </h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
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
        students={students}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {!isLoading && students.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      <StudentForm
        isOpen={isFormOpen}
        student={editingStudent}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Student"
        message={`Are you sure you want to delete ${
          deletingStudent
            ? deletingStudent.name ||
              `${deletingStudent.firstName || ""} ${
                deletingStudent.lastName || ""
              }`.trim() ||
              "this student"
            : "this student"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setDeletingStudent(null);
        }}
        isLoading={isDeleting}
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
