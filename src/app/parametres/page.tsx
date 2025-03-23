// src/app/parametres/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import DefaultBreadcrumb from "@/components/layout/DefaultBreadcrumb";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Charger le thème depuis localStorage au montage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // Par défaut, vérifier la préférence du système
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="container mx-auto p-6 pt-20 md:ml-64">
      <DefaultBreadcrumb />
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Paramètres</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Apparence
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {theme === "light" ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-400" />
            )}
            <span className="text-gray-800 dark:text-gray-200">
              Mode {theme === "light" ? "Clair" : "Sombre"}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Basculer
          </button>
        </div>
      </div>
    </div>
  );
}