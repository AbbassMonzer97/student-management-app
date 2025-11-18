import React from "react";

const Input = React.forwardRef(
  (
    {
      label,
      id,
      name,
      type = "text",
      value,
      onChange,
      onBlur,
      placeholder,
      error,
      required = false,
      disabled = false,
      readOnly = false,
      max,
      className = "",
      ...rest
    },
    ref
  ) => {
    const inputClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
    } ${
      readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
    } ${className}`;

    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          max={max}
          className={inputClasses}
          {...rest}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
