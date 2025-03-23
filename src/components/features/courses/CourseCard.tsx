// src/components/features/courses/CourseCard.tsx
"use client";
import Link from "next/link";
import { Package } from "lucide-react";

interface Course {
  id_liste: number;
  nom: string;
  date_creation?: string;
  id_utilisateur?: number;
  id_recette?: number | null;
  id_inventaire?: number | null;
  items: { id_item: number; id_ingredient: number; nom_ingredient: string; quantite: number; unite: string }[];
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const totalItems = course.items.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-3">
        <Package className="text-blue-500 dark:text-blue-400" size={20} />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{course.nom}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">Nombre d'éléments : {totalItems || "N/A"}</p>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        Date : {course.date_creation ? new Date(course.date_creation).toLocaleDateString() : "N/A"}
      </p>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        Recette associée : {course.id_recette ? `ID ${course.id_recette}` : "Aucune"}
      </p>
      <Link
        href={`/courses/${course.id_liste}`}
        className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Voir détails
      </Link>
    </div>
  );
}