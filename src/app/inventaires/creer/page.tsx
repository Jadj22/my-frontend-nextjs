"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface Ingredient {
  id_ingredient: number;
  nom: string;
}

interface InventaireForm {
  nom: string;
}

export default function CreerInventaire() {
  const [formData, setFormData] = useState<InventaireForm>({ nom: "" });
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

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
      setLoading(true);
      const response = await axios.get<{ ingredients: Ingredient[] }>(
          `${process.env.NEXT_PUBLIC_API_URL}/ingredients`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setIngredients(response.data.ingredients || []);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur de chargement des ingrédients.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom.trim()) {
      toast.error("Nom requis.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/inventaires`,
          { nom: formData.nom.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        const inventaireId = response.data.inventaire.id_inventaire;
        for (const id of selectedIngredients) {
          await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/inventaires/${inventaireId}/ingredients`,
              { id_ingredient: id, quantite_disponible: 0, unite: "g", prix_unitaire: null },
              { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        toast.success("Créé avec succès!");
        router.push(`/inventaires/${inventaireId}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur de création.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleIngredient = (id: number) => {
    setSelectedIngredients((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 flex items-center animate-fade-in">
            <Package className="mr-3 text-blue-400" size={30} /> Créer un Inventaire
          </h1>
          <Link href="/inventaires" className="mb-6 inline-flex items-center text-blue-400 hover:text-blue-300">
            <ArrowLeft className="mr-2" size={20} /> Retour
          </Link>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                  label="Nom de l’inventaire"
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex: Cuisine 2023"
                  required
              />
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Ingrédients</label>
                {loading ? (
                    <p className="text-gray-400">Chargement...</p>
                ) : ingredients.length > 0 ? (
                    <div className="border border-gray-700 rounded-md p-3 max-h-60 overflow-y-auto bg-gray-700">
                      {ingredients.map((ing) => (
                          <div key={ing.id_ingredient} className="flex items-center py-2">
                            <input
                                type="checkbox"
                                id={`ing-${ing.id_ingredient}`}
                                checked={selectedIngredients.includes(ing.id_ingredient)}
                                onChange={() => toggleIngredient(ing.id_ingredient)}
                                className="mr-2 h-4 w-4 text-blue-400 focus:ring-blue-500 border-gray-600 rounded"
                                disabled={isSubmitting}
                            />
                            <label htmlFor={`ing-${ing.id_ingredient}`} className="text-gray-200">
                              {ing.nom}
                            </label>
                          </div>
                      ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Aucun ingrédient.</p>
                )}
              </div>
              <Button type="submit" variant="primary" disabled={isSubmitting || loading}>
                {isSubmitting ? (
                    <span className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Création...
                </span>
                ) : "Créer l’inventaire"}
              </Button>
            </form>
          </div>
        </div>
      </div>
  );
}