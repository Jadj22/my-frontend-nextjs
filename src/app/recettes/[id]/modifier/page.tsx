"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRecetteById, getSuggestions } from "@/lib/api/recettes";
import { Recette, Ingredient, Etape } from "@/lib/api/recettes";
import axios from "axios";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import RecetteCard from "@/components/features/recettes/RecetteCard";
import { Plus, Trash, X, BookOpen, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ModifierRecettePage() {
  const { id } = useParams();
  const router = useRouter();
  const [recette, setRecette] = useState<Recette | null>(null);
  const [suggestions, setSuggestions] = useState<Recette[]>([]);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    temps_preparation: "",
    temps_cuisson: "",
    publique: false,
    ingredients: [] as Ingredient[],
    etapes: [] as Etape[],
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const recetteData = await getRecetteById(Number(id));
        setRecette(recetteData);
        setFormData({
          titre: recetteData.titre,
          description: recetteData.description || "",
          temps_preparation: recetteData.temps_preparation?.toString() || "",
          temps_cuisson: recetteData.temps_cuisson?.toString() || "",
          publique: recetteData.publique || false,
          ingredients: recetteData.ingredients.map((ing) => ({
            ...ing,
            quantite: ing.quantite?.toString() || "",
          })),
          etapes: recetteData.etapes.map((etape) => ({ instruction: etape.instruction })),
        });

        // Charger les suggestions uniquement si la recette est publique
        if (recetteData.publique) {
          const suggestionsData = await getSuggestions(4);
          const filteredSuggestions = suggestionsData.filter((r) => r.id_recette !== Number(id));
          setSuggestions(filteredSuggestions.slice(0, 4));
        }
      } catch (err: any) {
        setError(err.message || "Une erreur s'est produite lors du chargement des données.");
        console.error("Erreur :", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.titre.trim()) errors.titre = "Le titre est requis.";
    formData.ingredients.forEach((ing, index) => {
      if (!ing.nom.trim()) errors[`ingredient_${index}_nom`] = "Le nom de l'ingrédient est requis.";
      if (!ing.quantite || isNaN(Number(ing.quantite)) || Number(ing.quantite) <= 0)
        errors[`ingredient_${index}_quantite`] = "La quantité doit être un nombre positif.";
      if (!ing.unite?.trim()) errors[`ingredient_${index}_unite`] = "L'unité est requise.";
    });
    formData.etapes.forEach((etape, index) => {
      if (!etape.instruction.trim()) errors[`etape_${index}_instruction`] = "L'instruction est requise.";
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
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: field === "quantite" ? value : value };
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
    setFormErrors((prev) => ({ ...prev, [`ingredient_${index}_${field}`]: "" }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { id_ingredient: 0, nom: "", quantite: "", unite: "g", prix_unitaire: 0 }],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({ ...prev, ingredients: formData.ingredients.filter((_, i) => i !== index) }));
  };

  const handleEtapeChange = (index: number, value: string) => {
    const newEtapes = [...formData.etapes];
    newEtapes[index] = { instruction: value };
    setFormData((prev) => ({ ...prev, etapes: newEtapes }));
    setFormErrors((prev) => ({ ...prev, [`etape_${index}_instruction`]: "" }));
  };

  const addEtape = () => {
    setFormData((prev) => ({ ...prev, etapes: [...prev.etapes, { instruction: "" }] }));
  };

  const removeEtape = (index: number) => {
    setFormData((prev) => ({ ...prev, etapes: formData.etapes.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token d'authentification manquant.");

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/recettes/${id}`,
        {
          titre: formData.titre,
          description: formData.description,
          temps_preparation: Number(formData.temps_preparation) || 0,
          temps_cuisson: Number(formData.temps_cuisson) || 0,
          publique: formData.publique,
          ingredients: formData.ingredients.map((ing) => ({
            id_ingredient: ing.id_ingredient,
            nom: ing.nom,
            quantite: Number(ing.quantite) || 0,
            unite: ing.unite || "g",
          })),
          etapes: formData.etapes.map((etape) => ({ instruction: etape.instruction })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Recette modifiée avec succès !", { duration: 3000 });
      router.push(`/recettes/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la modification.", { duration: 4000 });
      console.error("Erreur :", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <p className="text-center text-red-500 dark:text-red-400 mt-10">{error}</p>
      </div>
    );
  if (!recette)
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Recette non trouvée.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Bouton de retour */}
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => router.push(`/recettes/${id}`)}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <ArrowLeft size={20} /> Retour
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8 flex items-center text-gray-800 dark:text-gray-100">
            <BookOpen className="mr-2 text-blue-500 dark:text-blue-400" />
            Modifier : {recette.titre}
          </h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 space-y-6 border border-gray-200 dark:border-gray-700"
          >
            <div>
              <label htmlFor="titre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Titre de la recette
              </label>
              <Input
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                placeholder="Titre de la recette"
                required
                className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
              />
              {formErrors.titre && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{formErrors.titre}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="temps_preparation"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Temps de préparation (min)
                </label>
                <Input
                  name="temps_preparation"
                  value={formData.temps_preparation}
                  onChange={handleChange}
                  placeholder="Temps de préparation (min)"
                  type="number"
                  className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                />
              </div>
              <div>
                <label
                  htmlFor="temps_cuisson"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Temps de cuisson (min)
                </label>
                <Input
                  name="temps_cuisson"
                  value={formData.temps_cuisson}
                  onChange={handleChange}
                  placeholder="Temps de cuisson (min)"
                  type="number"
                  className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibilité</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="publique"
                    checked={formData.publique}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Publique</span>
                </label>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  (Cochée = Publique, décochée = Privée)
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Ingrédients</h2>
              {formData.ingredients.map((ingredient, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex-1">
                    <Input
                      value={ingredient.nom}
                      onChange={(e) => handleIngredientChange(index, "nom", e.target.value)}
                      placeholder="Nom de l'ingrédient"
                      required
                      className="w-full bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-200"
                    />
                    {formErrors[`ingredient_${index}_nom`] && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {formErrors[`ingredient_${index}_nom`]}
                      </p>
                    )}
                  </div>
                  <div className="w-32">
                    <Input
                      value={ingredient.quantite?.toString() || ""}
                      onChange={(e) => handleIngredientChange(index, "quantite", e.target.value)}
                      placeholder="Quantité"
                      type="number"
                      className="w-full bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-200"
                    />
                    {formErrors[`ingredient_${index}_quantite`] && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {formErrors[`ingredient_${index}_quantite`]}
                      </p>
                    )}
                  </div>
                  <div className="w-24">
                    <Input
                      value={ingredient.unite || ""}
                      onChange={(e) => handleIngredientChange(index, "unite", e.target.value)}
                      placeholder="Unité (ex: g)"
                      className="w-full bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-200"
                    />
                    {formErrors[`ingredient_${index}_unite`] && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {formErrors[`ingredient_${index}_unite`]}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </motion.div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="mt-2 flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 transition-all shadow-md dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800"
              >
                <Plus size={18} className="mr-2" />
                Ajouter un ingrédient
              </button>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Étapes</h2>
              {formData.etapes.map((etape, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex-1">
                    <Input
                      value={etape.instruction}
                      onChange={(e) => handleEtapeChange(index, e.target.value)}
                      placeholder={`Étape ${index + 1}`}
                      required
                      className="w-full bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-200"
                    />
                    {formErrors[`etape_${index}_instruction`] && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {formErrors[`etape_${index}_instruction`]}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEtape(index)}
                    className="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </motion.div>
              ))}
              <button
                type="button"
                onClick={addEtape}
                className="mt-2 flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 transition-all shadow-md dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800"
              >
                <Plus size={18} className="mr-2" />
                Ajouter une étape
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(`/recettes/${id}`)}
                disabled={submitting}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
              >
                <X size={18} className="mr-2" />
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </div>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Suggestions de recettes publiques (affichées uniquement si la recette est publique) */}
        {recette.publique && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Autres Recettes Publiques</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestions.map((suggestion) => (
                <RecetteCard key={suggestion.id_recette} recette={suggestion} showSaveButton={true} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}