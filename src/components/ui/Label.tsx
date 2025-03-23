"use client";
import { ReactNode } from "react";

interface LabelProps {
  htmlFor?: string; // ID de l'élément associé (pour accessibilité)
  children: ReactNode; // Contenu de l'étiquette
  className?: string; // Classe CSS supplémentaire
  required?: boolean; // Indique si le champ est requis (ajoute un astérisque)
}

export default function Label({
  htmlFor,
  children,
  className = "",
  required = false,
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}