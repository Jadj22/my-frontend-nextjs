"use client";
import { useState } from "react";

interface FormField {
  value: string;
}

type FormValues<T extends Record<string, FormField>> = T;
type Errors<T> = Partial<Record<keyof T, string>>;
type ValidationRules<T> = Partial<Record<keyof T, (value: string) => string | null>>;

export const useForm = <T extends Record<string, FormField>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});

  const handleChange = (field: keyof T, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: { ...prev[field], value },
    }));
  };

  const validate = (rules: ValidationRules<T>): boolean => {
    const newErrors: Errors<T> = {};
    for (const field in rules) {
      const rule = rules[field];
      if (rule) {
        const error = rule(values[field].value);
        if (error) newErrors[field] = error;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, handleChange, validate };
};