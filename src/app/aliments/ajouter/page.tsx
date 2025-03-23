"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import { createIngredient } from "@/lib/api/ingredients";

interface IngredientForm {
  nom: string;
  unite: string;
  prix_unitaire: string;
}

interface FormErrors {
  nom?: string;
  prix_unitaire?: string;
}

export default function AjouterIngredient() {
  const [newIngredient, setNewIngredient] = useState<IngredientForm>({
    nom: "",
    unite: "g",
    prix_unitaire: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  const uniteOptions = [
    { value: "g", label: "Gramme (g)" },
    { value: "kg", label: "Kilogramme (kg)" },
    { value: "ml", label: "Millilitre (ml)" },
    { value: "l", label: "Litre (l)" },
    { value: "unité", label: "Unité" },
    { value: "cuillère à soupe", label: "Cuillère à soupe" },
    { value: "cuillère à café", label: "Cuillère à café" },
  ];

  // Real-time validation
  useEffect(() => {
    const newErrors = validateForm();
    setErrors(newErrors);
  }, [newIngredient.nom, newIngredient.prix_unitaire]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!newIngredient.nom.trim()) newErrors.nom = "Le nom de l'ingrédient est requis.";
    if (newIngredient.prix_unitaire) {
      const prix = parseFloat(newIngredient.prix_unitaire);
      if (isNaN(prix) || prix < 0) newErrors.prix_unitaire = "Le prix unitaire doit être un nombre positif.";
    }
    return newErrors;
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Veuillez vous connecter pour ajouter un ingrédient.");
      router.push("/");
      return;
    }
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const ingredientData = {
        nom: newIngredient.nom.trim(),
        unite: newIngredient.unite,
        prix_unitaire: newIngredient.prix_unitaire ? parseFloat(newIngredient.prix_unitaire) : undefined,
      };
      console.log("Données envoyées:", ingredientData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ingredients`,
        ingredientData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Réponse reçue:", response.data);
      if (response.status === 201) {
        toast.success("Ingrédient ajouté avec succès !", { duration: 3000 });
        router.push("/aliments");
      }
    } catch (error: any) {
      // console.error("Erreur complète:", error);
      // console.error("Statut:", error.response?.status);
      // console.error("Données de réponse:", error.response?.data);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout de l'ingrédient.", {
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 flex items-center text-gray-100">
            <ShoppingBag className="mr-3 text-blue-400" size={30} />
            Ajouter un Ingrédient
          </h1>
          <Link
              href="/aliments"
              className="mb-6 inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" size={20} />
            Retour à la liste
          </Link>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
            <form onSubmit={handleAddIngredient} className="space-y-6" noValidate>
              <InputField
                  label="Nom de l'ingrédient"
                  id="nom"
                  type="text"
                  value={newIngredient.nom}
                  onChange={(e) => setNewIngredient({ ...newIngredient, nom: e.target.value })}
                  error={errors.nom}
                  placeholder="Ex: Farine, Tomates..."
                  disabled={isSubmitting}
                  aria-required="true"
              />

              <SelectField
                  label="Unité"
                  id="unite"
                  value={newIngredient.unite}
                  onChange={(e) => setNewIngredient({ ...newIngredient, unite: e.target.value })}
                  options={uniteOptions}
                  disabled={isSubmitting}
              />

              <InputField
                  label="Prix unitaire (optionnel)"
                  id="prix_unitaire"
                  type="number"
                  step="0.01"
                  value={newIngredient.prix_unitaire}
                  onChange={(e) => setNewIngredient({ ...newIngredient, prix_unitaire: e.target.value })}
                  error={errors.prix_unitaire}
                  placeholder="Ex: 50 (en CFA)"
                  disabled={isSubmitting}
              />

              <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  aria-label={isSubmitting ? "Ajout en cours" : "Ajouter l'ingrédient"}
              >
                {isSubmitting ? (
                    <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeOpacity="0.5"
                      />
                      <path
                          d="M12 2v4m0 12v4m-6-6h4m8 0h-4"
                          fill="currentColor"
                          className="opacity-75"
                      />
                    </svg>
                ) : (
                    <Plus className="mr-2" size={18} />
                )}
                {isSubmitting ? "Ajout en cours..." : "Ajouter l'ingrédient"}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
}