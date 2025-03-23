"use client";
import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import { AuthProvider } from "@/context/AuthContext";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarExpanded");
    if (savedState !== null) {
      setIsSidebarExpanded(savedState === "true");
    }

    const handleStorageChange = () => {
      const updatedState = localStorage.getItem("sidebarExpanded");
      if (updatedState !== null) {
        setIsSidebarExpanded(updatedState === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarExpanded;
    setIsSidebarExpanded(newState);
    localStorage.setItem("sidebarExpanded", newState.toString());
  };

  return (
    <AuthProvider>
      <div className="flex w-full min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation
          orientation="vertical"
          onToggle={toggleSidebar}
          isOpen={isSidebarExpanded}
          className="fixed top-16 left-0 bottom-0 z-50" // Ajustement du positionnement
        />
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarExpanded ? "md:ml-64" : "md:ml-16"
          }`}
        >
          <Navigation
            orientation="horizontal"
            onToggle={toggleSidebar}
            isOpen={isSidebarExpanded}
            className="fixed top-0 left-0 right-0 z-50" // Assure que la barre horizontale reste au-dessus
          />
          <main className="p-4 pt-20">{children}</main> {/* pt-20 pour éviter le chevauchement avec la barre horizontale */}
        </div>
      </div>
    </AuthProvider>
  );
}