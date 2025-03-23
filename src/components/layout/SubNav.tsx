"use client";
import Link from "next/link";
import { Globe, Lock, Bookmark } from "lucide-react";

interface Tab {
  name: string;
  href: string;
  active: boolean;
}

interface SubNavProps {
  tabs: Tab[];
  onTabChange?: (tabName: string) => void; // Callback pour gérer le changement d'onglet
}

export default function SubNav({ tabs, onTabChange }: SubNavProps) {
  const getIconForTab = (name: string) => {
    switch (name.toLowerCase()) {
      case "publiques":
        return <Globe className="mr-2 text-blue-500 dark:text-blue-400" size={16} />;
      case "privées":
        return <Lock className="mr-2 text-gray-500 dark:text-gray-400" size={16} />;
      case "enregistrées":
        return <Bookmark className="mr-2 text-red-500 dark:text-red-400" size={16} />;
      default:
        return null;
    }
  };

  return (
    <nav className="flex space-x-2 sm:space-x-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm py-2 sticky top-0 z-10">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          onClick={(e) => {
            if (onTabChange) {
              e.preventDefault(); // Empêche la navigation par défaut si onTabChange est fourni
              onTabChange(tab.name);
            }
          }}
          className={`flex items-center px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            tab.active
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border-b-2 border-blue-500 dark:border-blue-400 shadow-inner"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          aria-current={tab.active ? "page" : undefined}
        >
          {getIconForTab(tab.name)}
          <span>{tab.name}</span>
        </Link>
      ))}
    </nav>
  );
}