import React from "react";

interface InputFieldProps {
  label?: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string; // Ajouté pour permettre des styles supplémentaires
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  required,
  className = "",
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${
          error ? "border-red-500 dark:border-red-400" : ""
        } ${className}`}
      />
      {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;