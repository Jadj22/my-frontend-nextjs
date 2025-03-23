"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import Button from "@/components/ui/Button";

interface Ingredient {
  id_ingredient: number;
  nom: string;
}

export default function AjouterIngredientInventaire() {
  const { id } = useParams();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<number | null>(null);
  const [quantite, setQuantite] = useState("");
  const [unite, setUnite] = useState("g");
  const [prixUnitaire, setPrixUnitaire] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingIngredients, setLoadingIngredients] = useState(true);
  const { token } = useAuth();
  const router = useRouter();

  const uniteOptions = [
    { value: "g", label: "Gramme (g)" },
    { value: "kg", label: "Kilogramme (kg)" },
    { value: "ml", label: "Millilitre (ml)" },
    { value: "l", label: "Litre (l)" },
    { value: "unité", label: "Unité" },
  ];

  useEffect(() => {
    if (!token) {
      toast.error("Connectez-vous.");
      router.push("/connexion");
      return;
    }
    fetchIngredients();
  }, [token, router]);

  const fetchIngredients = async () => {
    try {
      setLoadingIngredients(true);
      const response = await axios.get<{ ingredients: Ingredient[] }>(
          `${process.env.NEXT_PUBLIC_API_URL}/ingredients`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setIngredients(response.data.ingredients || []);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur de chargement des ingrédients.");
    } finally {
      setLoadingIngredients(false);
    }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedIngredient) {
      toast.error("Sélectionnez un ingrédient.");
      return;
    }
    const quantiteNum = parseFloat(quantite);
    if (isNaN(quantiteNum) || quantiteNum <= 0) {
      toast.error("Quantité invalide.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/inventaires/${id}/ingredients`,
          {
            id_ingredient: selectedIngredient,
            quantite_disponible: quantiteNum,
            unite,
            prix_unitaire: prixUnitaire ? parseFloat(prixUnitaire) : null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        toast.success("Ajouté avec succès!");
        router.push(`/inventaires/${id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur d'ajout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-6 flex items-center animate-fade-in">
            <Package className="mr-3 text-blue-400" size={30} /> Ajouter un Ingrédient
          </h1>
          <Link href={`/inventaires/${id}`} className="mb-6 inline-flex items-center text-blue-400 hover:text-blue-300">
            <ArrowLeft className="mr-2" size={20} /> Retour
          </Link>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
            <form onSubmit={handleAddIngredient} className="space-y-6">
              <SelectField
                  label="Ingrédient"
                  id="ingredient"
                  value={selectedIngredient?.toString() || ""}
                  onChange={(e) => setSelectedIngredient(parseInt(e.target.value) || null)}
                  options={[{ value: "", label: "Sélectionner..." }, ...ingredients.map(ing => ({ value: ing.id_ingredient.toString(), label: ing.nom }))]}
                  disabled={isSubmitting || loadingIngredients}
              />
              <InputField
                  label="Quantité disponible"
                  id="quantite"
                  type="number"
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value)}
                  placeholder="Ex: 200"
                  required
              />
              <SelectField
                  label="Unité"
                  id="unite"
                  value={unite}
                  onChange={(e) => setUnite(e.target.value)}
                  options={uniteOptions}
                  disabled={isSubmitting}
              />
              <InputField
                  label="Prix unitaire (optionnel)"
                  id="prix_unitaire"
                  type="number"
                  step="0.01"
                  value={prixUnitaire}
                  onChange={(e) => setPrixUnitaire(e.target.value)}
                  placeholder="Ex: 1.50 (en CFA)"
              />
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                    <span className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Ajout...
                </span>
                ) : "Ajouter l'ingrédient"}
              </Button>
            </form>
          </div>
        </div>
      </div>
  );
}