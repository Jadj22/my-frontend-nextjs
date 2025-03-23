import { useState } from "react";

interface FormField {
  value: string | number | boolean;
  error?: string;
}

export function useForm(initialValues: Record<string, any>) {
  const [values, setValues] = useState<FormField>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [name]: { value, error: undefined } }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (rules: Record<string, (value: any) => string | null>) => {
    const newErrors: Record<string, string> = {};
    Object.keys(rules).forEach((key) => {
      const error = rules[key](values[key]?.value);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, validate, reset };
}