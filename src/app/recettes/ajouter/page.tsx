"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Plus, Trash, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface Ingredient {
  nom: string;
  quantite: string;
  unite: string;
}

interface Etape {
  instruction: string;
}

interface FormData {
  titre: string;
  description: string;
  temps_preparation: string;
  temps_cuisson: string;
  publique: boolean;
  ingredients: Ingredient[];
  etapes: Etape[];
}

export default function AjouterRecettePage() {
  const router = useRouter();
  const { token } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    titre: "",
    description: "",
    temps_preparation: "",
    temps_cuisson: "",
    publique: false,
    ingredients: [{ nom: "", quantite: "", unite: "g" }],
    etapes: [{ instruction: "" }],
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // Synchronisation avec le thème global (suppression du bouton toggle)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.titre.trim()) errors.titre = "Le titre est requis.";
    formData.ingredients.forEach((ing, index) => {
      if (!ing.nom.trim()) errors[`ingredient_${index}_nom`] = "Le nom est requis.";
      if (!ing.quantite || isNaN(Number(ing.quantite)) || Number(ing.quantite) <= 0)
        errors[`ingredient_${index}_quantite`] = "Quantité invalide.";
      if (!ing.unite?.trim()) errors[`ingredient_${index}_unite`] = "Unité requise.";
    });
    formData.etapes.forEach((etape, index) => {
      if (!etape.instruction.trim()) errors[`etape_${index}_instruction`] = "Instruction requise.";
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name in formErrors) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
    if (field in formErrors) setFormErrors((prev) => ({ ...prev, [`ingredient_${index}_${field}`]: "" }));
  };

  const addIngredient = () => setFormData((prev) => ({
    ...prev,
    ingredients: [...prev.ingredients, { nom: "", quantite: "", unite: "g" }],
  }));

  const removeIngredient = (index: number) => setFormData((prev) => ({
    ...prev,
    ingredients: prev.ingredients.filter((_, i) => i !== index),
  }));

  const handleEtapeChange = (index: number, value: string) => {
    const newEtapes = [...formData.etapes];
    newEtapes[index] = { instruction: value };
    setFormData((prev) => ({ ...prev, etapes: newEtapes }));
    if (index in formErrors) setFormErrors((prev) => ({ ...prev, [`etape_${index}_instruction`]: "" }));
  };

  const addEtape = () => setFormData((prev) => ({
    ...prev,
    etapes: [...prev.etapes, { instruction: "" }],
  }));

  const removeEtape = (index: number) => setFormData((prev) => ({
    ...prev,
    etapes: prev.etapes.filter((_, i) => i !== index),
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) return;
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/recettes`,
        {
          titre: formData.titre,
          description: formData.description,
          temps_preparation: Number(formData.temps_preparation) || 0,
          temps_cuisson: Number(formData.temps_cuisson) || 0,
          publique: formData.publique,
          ingredients: formData.ingredients.map((ing) => ({
            nom: ing.nom,
            quantite: Number(ing.quantite) || 0,
            unite: ing.unite,
          })),
          etapes: formData.etapes.map((etape, index) => ({
            ordre: index + 1,
            instruction: etape.instruction,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        toast.success("Recette ajoutée avec succès !", { duration: 3000 });
        router.push("/recettes/publiques");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout.", { duration: 4000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center animate-fade-in">
          <Plus className="mr-3 text-blue-400" size={30} /> Ajouter une Recette
        </h1>
        <Link href="/recettes" className="mb-6 inline-flex items-center text-blue-400 hover:text-blue-300 dark:hover:text-blue-200">
          <ArrowLeft className="mr-2" size={20} /> Retour
        </Link>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <InputField
              label="Titre"
              id="titre"
              value={formData.titre}
              onChange={handleChange}
              error={formErrors.titre}
              placeholder="Ex: Lasagne au fromage"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez la recette..."
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Temps de préparation (min)"
                id="temps_preparation"
                type="number"
                value={formData.temps_preparation}
                onChange={handleChange}
                placeholder="Ex: 30"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
              <InputField
                label="Temps de cuisson (min)"
                id="temps_cuisson"
                type="number"
                value={formData.temps_cuisson}
                onChange={handleChange}
                placeholder="Ex: 45"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Visibilité
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="publique"
                    checked={formData.publique}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-blue-400 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded-md"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Publique</span>
                </label>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  (Décochée = Privée)
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Ingrédients
              </h2>
              {formData.ingredients.map((ing, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                >
                  <InputField
                    value={ing.nom}
                    onChange={(e) => handleIngredientChange(index, "nom", e.target.value)}
                    placeholder="Nom"
                    error={formErrors[`ingredient_${index}_nom`]}
                    required
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500"
                  />
                  <InputField
                    value={ing.quantite}
                    onChange={(e) => handleIngredientChange(index, "quantite", e.target.value)}
                    placeholder="Quantité"
                    type="number"
                    error={formErrors[`ingredient_${index}_quantite`]}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500"
                  />
                  <InputField
                    value={ing.unite}
                    onChange={(e) => handleIngredientChange(index, "unite", e.target.value)}
                    placeholder="Unité (ex: g)"
                    error={formErrors[`ingredient_${index}_unite`]}
                    required
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500"
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    aria-label="Supprimer ingrédient"
                    className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                onClick={addIngredient}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                <Plus size={16} className="mr-2" /> Ajouter un ingrédient
              </Button>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Étapes
              </h2>
              {formData.etapes.map((etape, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                >
                  <InputField
                    value={etape.instruction}
                    onChange={(e) => handleEtapeChange(index, e.target.value)}
                    placeholder={`Étape ${index + 1}`}
                    error={formErrors[`etape_${index}_instruction`]}
                    required
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500"
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeEtape(index)}
                    aria-label="Supprimer étape"
                    className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                onClick={addEtape}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                <Plus size={16} className="mr-2" /> Ajouter une étape
              </Button>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => router.push("/recettes")}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                <X size={16} className="mr-2" /> Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </span>
                ) : (
                  "Ajouter la recette"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}