// src/app/courses/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { Package } from "lucide-react";
import { getCourseById, deleteCourse } from "@/lib/api/courses";
import Button from "@/components/ui/Button";

interface Course {
  id_liste: number;
  nom: string;
  date_creation?: string;
  id_utilisateur?: number;
  id_recette?: number | null;
  id_inventaire?: number | null;
  items: { id_item: number; id_ingredient: number; nom_ingredient: string; quantite: number; unite: string }[];
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { data: courseData, error, loading, execute } = useApi<Course>();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/";
      return;
    }
    if (user && id) {
      const token = localStorage.getItem("accessToken");
      execute(() => getCourseById(Number(id), token));
    }
  }, [isAuthenticated, execute, id, user]);

  const handleDelete = async () => {
    if (confirm("Voulez-vous vraiment supprimer cette liste ?")) {
      setIsDeleting(true);
      try {
        const token = localStorage.getItem("accessToken");
        await deleteCourse(Number(id), token);
        window.location.href = "/courses";
      } catch (err: any) {
        alert(err.message || "Erreur lors de la suppression");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) return <p className="text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!courseData) return null;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center text-gray-800">
          <Package className="mr-2 text-blue-500" /> {courseData.nom}
        </h1>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        >
          {isDeleting ? "Suppression..." : "Supprimer"}
        </Button>
      </div>
      <div className="space-y-4">
        <p className="text-gray-600">
          Date : {courseData.date_creation ? new Date(courseData.date_creation).toLocaleDateString() : "N/A"}
        </p>
        <p className="text-gray-600">
          Recette associée : {courseData.id_recette ? `ID ${courseData.id_recette}` : "Aucune"}
        </p>
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Items :</h2>
          {courseData.items.length > 0 ? (
            <ul className="space-y-2">
              {courseData.items.map((item) => (
                <li key={item.id_item} className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                  <span className="font-medium">{item.nom_ingredient}</span> - {item.quantite} {item.unite}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucun item dans cette liste</p>
          )}
        </div>
      </div>
    </div>
  );
}