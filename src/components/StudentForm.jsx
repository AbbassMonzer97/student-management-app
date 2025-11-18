import { useState, useEffect } from "react";
import { getClasses } from "../api/classesApi";
import { createStudentCreateUpdateDto } from "../types/studentDto";
import Input from "./Input";

const StudentForm = ({
  isOpen,
  student,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    classIds: [],
  });
  const [availableClasses, setAvailableClasses] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingClasses, setLoadingClasses] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadClasses();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && student) {
      const classes = student.classes || [];
      const classIds = classes.map((cls) =>
        typeof cls === "object" ? cls.id || cls.classId : cls
      );

      let formattedDateOfBirth = "";
      if (student.dateOfBirth) {
        try {
          const date = new Date(student.dateOfBirth);
          if (!isNaN(date.getTime())) {
            formattedDateOfBirth = date.toISOString().split("T")[0];
          }
        } catch {
          formattedDateOfBirth = student.dateOfBirth;
        }
      }

      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        dateOfBirth: formattedDateOfBirth,
        classIds: classIds,
      });
      setErrors({});
    } else if (isOpen) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        classIds: [],
      });
      setErrors({});
    }
  }, [isOpen, student]);

  const loadClasses = async () => {
    setLoadingClasses(true);
    try {
      const data = await getClasses();

      const classes = Array.isArray(data)
        ? data
        : data.items || data.data || [];
      setAvailableClasses(classes);
    } catch (error) {
      console.error("Failed to load classes:", error);
      setErrors({ classes: "Failed to load classes. Please try again." });
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleClassToggle = (classId) => {
    setFormData((prev) => {
      const classIds = prev.classIds.includes(classId)
        ? prev.classIds.filter((id) => id !== classId)
        : [...prev.classIds, classId];
      return { ...prev, classIds };
    });
    if (errors.classIds) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.classIds;
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.dateOfBirth) {
      const date = new Date(formData.dateOfBirth);
      if (isNaN(date.getTime())) {
        newErrors.dateOfBirth = "Please enter a valid date";
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateOfBirth = new Date(date);
        dateOfBirth.setHours(0, 0, 0, 0);

        if (dateOfBirth > today) {
          newErrors.dateOfBirth = "Date of birth cannot be after today's date";
        }
      }
    }

    if (formData.classIds.length === 0) {
      newErrors.classIds = "Please select at least one class";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = createStudentCreateUpdateDto({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      dateOfBirth: formData.dateOfBirth,
      classIds: formData.classIds,
    });

    onSubmit(payload);
  };

  if (!isOpen) return null;

  const getClassName = (cls) => {
    if (typeof cls === "string") return cls;
    return cls.name || cls.className || cls.code || `Class ${cls.id || ""}`;
  };

  const getClassId = (cls) => {
    if (typeof cls === "string" || typeof cls === "number") return cls;
    return cls.id || cls.classId;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={!isLoading ? onClose : undefined}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {student ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none disabled:opacity-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {student && (
            <Input
              label="ID"
              id="id"
              value={student.id || ""}
              readOnly={true}
              disabled={true}
            />
          )}

          <Input
            label="First Name"
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            error={errors.firstName}
            required={true}
            disabled={isLoading}
          />

          <Input
            label="Last Name"
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            error={errors.lastName}
            required={true}
            disabled={isLoading}
          />

          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="student@example.com"
            error={errors.email}
            disabled={isLoading}
          />

          <Input
            label="Date of Birth"
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            error={errors.dateOfBirth}
            disabled={isLoading}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classes <span className="text-red-500">*</span>
            </label>
            {loadingClasses ? (
              <div className="text-sm text-gray-500">Loading classes...</div>
            ) : errors.classes ? (
              <div className="text-sm text-red-600">{errors.classes}</div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                {availableClasses.length === 0 ? (
                  <p className="text-sm text-gray-500">No classes available</p>
                ) : (
                  <div className="space-y-2">
                    {availableClasses.map((cls) => {
                      const classId = getClassId(cls);
                      const className = getClassName(cls);
                      const isSelected = formData.classIds.includes(classId);
                      return (
                        <label
                          key={classId}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleClassToggle(classId)}
                            disabled={isLoading}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {className}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {errors.classIds && (
              <p className="mt-1 text-sm text-red-600">{errors.classIds}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading && (
                <img
                  src="/spinner.svg"
                  alt="Loading"
                  className="animate-spin h-4 w-4"
                />
              )}
              {student ? "Update Student" : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
