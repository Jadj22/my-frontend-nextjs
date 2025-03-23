"use client";
// import { ReactNode } from "react";

// interface InputProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   type?: string;
//   icon?: ReactNode;
//   error?: string;
// }

// export default function Input({ value, onChange, placeholder = "", type = "text", icon, error }: InputProps) {
//   return (
//     <div className="mb-4">
//       <div className="flex items-center border rounded">
//         {icon && <span className="ml-2 text-gray-500">{icon}</span>}
//         <input
//           type={type}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={placeholder}
//           className="w-full p-2 outline-none"
//         />
//       </div>
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// }

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}