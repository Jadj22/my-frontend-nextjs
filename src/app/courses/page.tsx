// src/app/courses/inventaire/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { Package, Loader2 } from "lucide-react";
import { getInventaires } from "@/lib/api/inventaires";
import { getRecettes, getSavedRecettes } from "@/lib/api/recettes";
import { generer_liste_courses, createCourse } from "@/lib/api/courses";
import Button from "@/components/ui/Button";

interface ShoppingListItem {
  id_ingredient: number;
  nom: string;
  quantite_manquante: number;
  unite: string;
  prix_unitaire: number;
  cout: number;
}

interface Inventaire {
  id_inventaire: number;
  nom: string;
}

interface Recette {
  id_recette: number;
  titre: string;
  isSaved?: boolean;
}

interface Course {
  id_liste: number;
  nom: string;
  items: { id_item: number; id_ingredient: number; nom_ingredient: string; quantite: number; unite: string }[];
}

export default function CoursesInventairePage() {
  const { user, isAuthenticated } = useAuth();
  const { data: coursesData, error, loading, execute } = useApi<any>();
  const { data: inventairesData, execute: fetchInventaires } = useApi<{ inventaires: Inventaire[] }>();
  const { data: ownRecettesData, execute: fetchOwnRecettes } = useApi<{ recettes: Recette[] }>();
  const { data: savedRecettesData, execute: fetchSavedRecettes } = useApi<{ recettes: Recette[] }>();
  const [selectedInventory, setSelectedInventory] = useState<string>("");
  const [selectedRecette, setSelectedRecette] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/auth/connexion";
      return;
    }
    if (user) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        fetchInventaires(() => getInventaires(1, 100, "", token));
        fetchOwnRecettes(() => getRecettes(1, 100, { owner: true }, token));
        fetchSavedRecettes(() => getSavedRecettes(1, 100, "", token));
      } else {
        console.warn("Token manquant dans localStorage");
        window.location.href = "/auth/connexion";
      }
    }
  }, [isAuthenticated, fetchInventaires, fetchOwnRecettes, fetchSavedRecettes, user]);

  const handleGenerate = async () => {
    if (!selectedInventory || !selectedRecette) {
      alert("Veuillez sélectionner un inventaire et une recette");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Session expirée. Veuillez vous reconnecter.");
      window.location.href = "/auth/connexion";
      return;
    }
    try {
      await execute(async () => {
        const result = await generer_liste_courses(Number(selectedInventory), Number(selectedRecette), token);
        const courseData = {
          nom: `Liste pour recette ${selectedRecette}`,
          id_recette: Number(selectedRecette),
          items: result.liste_courses.map((item: ShoppingListItem) => ({
            id_ingredient: item.id_ingredient,
            quantite: item.quantite_manquante,
            unite: item.unite,
          })),
        };
        const createdCourse = await createCourse(courseData, token);
        if (createdCourse.id_liste) {
          window.location.href = `/courses/${createdCourse.id_liste}`;
        } else {
          throw new Error("La liste n’a pas été créée correctement");
        }
        return result;
      });
    } catch (err: any) {
      alert(err.message || "Erreur lors de la génération de la liste");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold flex items-center text-gray-800 dark:text-gray-100 mb-6">
        <Package className="mr-2 text-blue-500 dark:text-blue-400" /> Générer une Liste de Courses
      </h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sélectionner un inventaire
          </label>
          <select
            value={selectedInventory}
            onChange={(e) => setSelectedInventory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="">Sélectionner un inventaire</option>
            {inventairesData?.inventaires?.length > 0 ? (
              inventairesData.inventaires.map((inv) => (
                <option key={inv.id_inventaire} value={inv.id_inventaire}>
                  {inv.nom}
                </option>
              ))
            ) : (
              <option value="" disabled>Aucun inventaire disponible</option>
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sélectionner une recette
          </label>
          <select
            value={selectedRecette}
            onChange={(e) => setSelectedRecette(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="">Sélectionner une recette</option>
            <optgroup label="Mes recettes">
              {ownRecettesData?.recettes.map((rec) => (
                <option key={rec.id_recette} value={rec.id_recette}>
                  {rec.titre}
                </option>
              ))}
            </optgroup>
            <optgroup label="Recettes enregistrées">
              {savedRecettesData?.recettes.map((rec) => (
                <option key={rec.id_recette} value={rec.id_recette}>
                  {rec.titre}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={loading || !selectedInventory || !selectedRecette}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {loading ? <Loader2 className="mr-2 animate-spin" /> : null} {loading ? "Génération..." : "Générer la liste"}
        </Button>

        {loading && <p className="text-center text-gray-500 dark:text-gray-400">Chargement...</p>}
        {error && <p className="text-red-500 dark:text-red-400 mt-2">Erreur : {error}</p>}
        {coursesData?.liste_courses && (
          <div className="mt-6 space-y-4">
            {coursesData.liste_courses.map((item: ShoppingListItem) => (
              <div
                key={item.id_ingredient}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex items-center space-x-2">
                  <Package className="text-blue-500 dark:text-blue-400" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.nom}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Quantité : {item.quantite_manquante} {item.unite}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Prix unitaire : {item.prix_unitaire.toFixed(2)} € - Total : {item.cout.toFixed(2)} €
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}