"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Package, ArrowLeft, Edit, Trash, Plus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

interface Inventaire {
  id_inventaire: number;
  nom: string;
  publique: boolean;
  id_utilisateur: number;
  ingredients: InventaireIngredient[];
}

interface InventaireIngredient {
  id_inventaire_ingredient: number;
  id_inventaire: number;
  id_ingredient: number;
  nom_ingredient: string;
  quantite_disponible: number;
  unite: string;
  prix_unitaire: number | null;
}

export default function InventaireDetails() {
  const { id } = useParams();
  const [inventaire, setInventaire] = useState<Inventaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [editIngredient, setEditIngredient] = useState<InventaireIngredient | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.error("Connectez-vous.");
      router.push("/connexion");
      return;
    }
    fetchInventaire();
  }, [id, token, router]);

  const fetchInventaire = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ inventaire: Inventaire }>(
          `${process.env.NEXT_PUBLIC_API_URL}/inventaires/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setInventaire(response.data.inventaire);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editIngredient) return;
    try {
      const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/inventaires/${id}/ingredients/${editIngredient.id_inventaire_ingredient}`,
          {
            quantite_disponible: parseFloat(editIngredient.quantite_disponible.toString()),
            unite: editIngredient.unite,
            prix_unitaire: editIngredient.prix_unitaire,
          },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Mis à jour avec succès!");
        setEditIngredient(null);
        fetchInventaire();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur de mise à jour.");
    }
  };

  const handleDeleteIngredient = async (idIngredient: number) => {
    if (!confirm("Confirmer ?")) return;
    try {
      const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/inventaires/${id}/ingredients/${idIngredient}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Supprimé avec succès!");
        fetchInventaire();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur de suppression.");
    }
  };

  if (loading) return <p className="text-center text-gray-400">Chargement...</p>;
  if (!inventaire) return <p className="text-center text-gray-400">Introuvable.</p>;

  return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 flex items-center animate-fade-in">
            <Package className="mr-3 text-blue-400" size={30} /> {inventaire.nom}
          </h1>
          <Link href="/inventaires" className="mb-6 inline-flex items-center text-blue-400 hover:text-blue-300">
            <ArrowLeft className="mr-2" size={20} /> Retour
          </Link>

          {editIngredient && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2 text-gray-200">Modifier l'ingrédient</h2>
                <form onSubmit={handleUpdateIngredient} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <InputField
                      type="number"
                      value={editIngredient.quantite_disponible}
                      onChange={(e) => setEditIngredient({ ...editIngredient, quantite_disponible: parseFloat(e.target.value) || 0 })}
                      placeholder="Quantité"
                  />
                  <InputField
                      value={editIngredient.unite}
                      onChange={(e) => setEditIngredient({ ...editIngredient, unite: e.target.value })}
                      placeholder="Unité"
                  />
                  <InputField
                      type="number"
                      step="0.01"
                      value={editIngredient.prix_unitaire || ""}
                      onChange={(e) => setEditIngredient({ ...editIngredient, prix_unitaire: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="Prix"
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" type="submit">Enregistrer</Button>
                    <Button variant="secondary" onClick={() => setEditIngredient(null)}>Annuler</Button>
                  </div>
                </form>
              </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Ingrédients</h2>
            {inventaire.ingredients.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {inventaire.ingredients.map((ing) => (
                      <div key={ing.id_inventaire_ingredient} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-200">{ing.nom_ingredient}</h3>
                          <p className="text-gray-400">{ing.quantite_disponible} {ing.unite}</p>
                          <p className="text-gray-400">{ing.prix_unitaire ? `${ing.prix_unitaire} €` : "Prix non défini"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => setEditIngredient(ing)}><Edit size={16} /></Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteIngredient(ing.id_inventaire_ingredient)}><Trash size={16} /></Button>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <p className="text-center text-gray-400">Aucun ingrédient.</p>
            )}
          </div>
          <Link href={`/inventaires/${id}/ajouter-ingredient`} className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="mr-2" size={18} /> Ajouter un ingrédient
          </Link>
        </div>
      </div>
  );
}