// src/components/features/courses/CourseList.tsx
"use client";
import CourseCard from "./CourseCard";

interface Course {
  id_liste: number;
  nom: string;
  date_creation?: string;
  id_utilisateur?: number;
  id_recette?: number | null;
  id_inventaire?: number | null;
  items: { id_item: number; id_ingredient: number; nom_ingredient: string; quantite: number; unite: string }[];
}

interface CourseListProps {
  courses: Course[];
}

export default function CourseList({ courses }: CourseListProps) {
  if (!courses?.length) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-4">Aucune liste de courses trouvée</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      {courses.map((course) => (
        <CourseCard key={course.id_liste} course={course} />
      ))}
    </div>
  );
}