"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { createCourse } from "@/lib/api/courses";
import { getRecettes, getSavedRecettes } from "@/lib/api/recettes";
import { getIngredients } from "@/lib/api/ingredients";
import { Package } from "lucide-react";
import Button from "@/components/ui/Button";

interface Recette {
  id_recette: number;
  titre: string;
  isSaved?: boolean;
}

interface Ingredient {
  id_ingredient: number;
  nom: string;
}

interface Item {
  id_ingredient: number;
  quantite: number;
  unite: string;
}

interface Course {
  id_liste: number;
  nom: string;
  items: { id_item: number; id_ingredient: number; nom_ingredient: string; quantite: number; unite: string }[];
}

export default function CreerListeCoursesPage() {
  const { isAuthenticated } = useAuth();
  const { data: listeData, error, loading, execute } = useApi<Course>();
  const { data: ownRecettesData, execute: fetchOwnRecettes } = useApi<{ recettes: Recette[] }>();
  const { data: savedRecettesData, execute: fetchSavedRecettes } = useApi<{ recettes: Recette[] }>();
  const { data: ingredientsData, execute: fetchIngredients } = useApi<{ ingredients: Ingredient[] }>();
  const [nom, setNom] = useState("");
  const [selectedRecette, setSelectedRecette] = useState<string>("");
  const [items, setItems] = useState<Item[]>([{ id_ingredient: 0, quantite: 0, unite: "g" }]);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/";
      return;
    }
    if (isAuthenticated) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        fetchOwnRecettes(() => getRecettes(1, 100, { owner: true }, token));
        fetchSavedRecettes(() => getSavedRecettes(1, 100, token));
        fetchIngredients(() => getIngredients(1, 100, token));
      } else {
        console.warn("Token manquant dans localStorage");
        window.location.href = "/";
      }
    }
  }, [isAuthenticated, fetchOwnRecettes, fetchSavedRecettes, fetchIngredients]);

  const handleAddItem = () => {
    setItems([...items, { id_ingredient: 0, quantite: 0, unite: "g" }]);
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: typeof value === "string" ? value : Number(value) } : item
      )
    );
  };

  const handleSubmit = async () => {
    if (!nom) {
      alert("Veuillez entrer un nom pour la liste");
      return;
    }
    const validItems = items
      .map((item) => ({
        id_ingredient: Number(item.id_ingredient),
        quantite: Number(item.quantite),
        unite: item.unite,
      }))
      .filter((item) => item.id_ingredient > 0 && item.quantite > 0);
    if (!validItems.length && !selectedRecette) {
      alert("Ajoutez au moins un item valide ou sélectionnez une recette");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("Token manquant dans localStorage");
      window.location.href = "/";
      return;
    }
    const courseData = {
      nom,
      id_recette: selectedRecette ? Number(selectedRecette) : undefined,
      items: validItems,
    };
    await execute(async () => {
      const result = await createCourse(courseData, token);
      if (result.id_liste) {
        window.location.href = `/courses/${result.id_liste}`;
      }
      return result;
    });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto p-6 max-w-2xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold flex items-center text-gray-800 dark:text-gray-100 mb-6">
        <Package className="mr-2 text-blue-500 dark:text-blue-400" /> Créer une Liste de Courses
      </h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de la liste</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom de la liste"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recette associée (optionnel)
          </label>
          <select
            value={selectedRecette}
            onChange={(e) => setSelectedRecette(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="">Sélectionner une recette</option>
            <optgroup label="Mes recettes">
              {ownRecettesData?.recettes.map((recette) => (
                <option key={recette.id_recette} value={recette.id_recette}>
                  {recette.titre}
                </option>
              ))}
            </optgroup>
            <optgroup label="Recettes enregistrées">
              {savedRecettesData?.recettes.map((recette) => (
                <option key={recette.id_recette} value={recette.id_recette}>
                  {recette.titre}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Items</label>
          {items.map((item, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <select
                value={item.id_ingredient}
                onChange={(e) => handleItemChange(index, "id_ingredient", e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="0">Ingrédient</option>
                {ingredientsData?.ingredients.map((ing) => (
                  <option key={ing.id_ingredient} value={ing.id_ingredient}>
                    {ing.nom}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantite}
                onChange={(e) => handleItemChange(index, "quantite", e.target.value)}
                placeholder="Quantité"
                className="w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
              <select
                value={item.unite}
                onChange={(e) => handleItemChange(index, "unite", e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="mL">mL</option>
                <option value="L">L</option>
                <option value="unités">unités</option>
              </select>
            </div>
          ))}
          <Button
            onClick={handleAddItem}
            className="mt-2 bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
          >
            Ajouter un item
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {loading ? "Création..." : "Créer la liste"}
        </Button>

        {error && <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>}
        {listeData && <p className="text-green-500 dark:text-green-400 mt-2">Liste créée avec succès !</p>}
      </div>
    </div>
  );
}