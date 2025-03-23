// components/SelectField.tsx
"use client";
import { SelectHTMLAttributes } from "react";

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: Option[];
    error?: string;
    id: string;
    disabled?: boolean;
}

export default function SelectField({
                                        label,
                                        options,
                                        error,
                                        id,
                                        disabled = false,
                                        ...props
                                    }: SelectFieldProps) {
    return (
        <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 dark:text-gray-400">
                {label}
            </label>
            <select
                id={id}
                disabled={disabled}
                className={`w-full p-3 border rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    error ? "border-red-500" : "border-gray-600"
                }`}
                aria-describedby={error ? `${id}-error` : undefined}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p id={`${id}-error`} className="text-sm text-red-500" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}