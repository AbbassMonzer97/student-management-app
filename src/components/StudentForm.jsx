import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { getClasses } from "../services/classes";
import { createStudentCreateUpdateDto } from "../types/studentDto";
import Input from "./Input";

const StudentForm = ({
  isOpen,
  student,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      classIds: [],
    },
  });

  const [availableClasses, setAvailableClasses] = useState([]);
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

      reset({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        dateOfBirth: formattedDateOfBirth,
        classIds: classIds,
      });
    } else if (isOpen) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        classIds: [],
      });
    }
  }, [isOpen, student, reset]);

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
    } finally {
      setLoadingClasses(false);
    }
  };

  const validateDateOfBirth = (dateString) => {
    if (!dateString) return true; // Optional field

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Please enter a valid date";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateOfBirth = new Date(date);
    dateOfBirth.setHours(0, 0, 0, 0);

    if (dateOfBirth > today) {
      return "Date of birth cannot be after today's date";
    }

    return true;
  };

  const validateClassIds = (classIds) => {
    if (!classIds || classIds.length === 0) {
      return "Please select at least one class";
    }
    return true;
  };

  const onSubmitForm = (data) => {
    const payload = createStudentCreateUpdateDto({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      dateOfBirth: data.dateOfBirth,
      classIds: data.classIds,
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

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
          {student && (
            <Input
              label="ID"
              id="id"
              value={student.id || ""}
              readOnly={true}
              disabled={true}
            />
          )}

          <div>
            <Input
              label="First Name"
              id="firstName"
              name="firstName"
              type="text"
              {...register("firstName", {
                required: "First name is required",
                validate: (value) =>
                  value.trim() !== "" || "First name is required",
              })}
              placeholder="Enter first name"
              error={errors.firstName?.message}
              required={true}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Last Name"
              id="lastName"
              name="lastName"
              type="text"
              {...register("lastName", {
                required: "Last name is required",
                validate: (value) =>
                  value.trim() !== "" || "Last name is required",
              })}
              placeholder="Enter last name"
              error={errors.lastName?.message}
              required={true}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              placeholder="student@example.com"
              error={errors.email?.message}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Date of Birth"
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              {...register("dateOfBirth", {
                validate: validateDateOfBirth,
              })}
              max={new Date().toISOString().split("T")[0]}
              error={errors.dateOfBirth?.message}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classes <span className="text-red-500">*</span>
            </label>
            {loadingClasses ? (
              <div className="text-sm text-gray-500">Loading classes...</div>
            ) : (
              <Controller
                name="classIds"
                control={control}
                rules={{ validate: validateClassIds }}
                render={({ field }) => (
                  <>
                    <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                      {availableClasses.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No classes available
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {availableClasses.map((cls) => {
                            const classId = getClassId(cls);
                            const className = getClassName(cls);
                            const isSelected =
                              field.value?.includes(classId) || false;
                            return (
                              <label
                                key={classId}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const currentValue = field.value || [];
                                    if (e.target.checked) {
                                      field.onChange([
                                        ...currentValue,
                                        classId,
                                      ]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (id) => id !== classId
                                        )
                                      );
                                    }
                                  }}
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
                    {errors.classIds && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.classIds.message}
                      </p>
                    )}
                  </>
                )}
              />
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
