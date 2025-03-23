"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import SubNav from "@/components/layout/SubNav";
import { ShoppingBag, Edit, Trash, Plus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import IngredientList from "@/components/features/aliments/IngredientList";

interface Ingredient {
  id_ingredient: number;
  nom: string;
  unite: string;
  prix_unitaire: number | null;
}

interface PaginationResponse {
  ingredients: Ingredient[];
  total: number;
  pages: number;
  current_page: number;
}

export default function AlimentsLayout() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null);
  const { token } = useAuth();
  const tabs = [{ name: "Mes Ingrédients", href: "/aliments", active: true }];

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await axios.get<PaginationResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/ingredients?page=${page}&per_page=10${searchTerm ? `&search=${searchTerm}` : ""}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setIngredients(response.data.ingredients || []);
      setTotalPages(response.data.pages || 1);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des ingrédients :", error);
      toast.error(error.response?.data?.message || "Erreur lors du chargement des ingrédients.");
      setIngredients([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchIngredients();
  }, [page, searchTerm, token]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleEditIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editIngredient) return;

    try {
      const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/ingredients/${editIngredient.id_ingredient}`,
          {
            nom: editIngredient.nom,
            unite: editIngredient.unite,
            prix_unitaire: editIngredient.prix_unitaire || null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Ingrédient modifié avec succès !");
        setEditIngredient(null);
        fetchIngredients();
      }
    } catch (error: any) {
      console.error("Erreur lors de la modification :", error);
      toast.error(error.response?.data?.message || "Erreur lors de la modification.");
    }
  };

  const handleDeleteIngredient = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet ingrédient ?")) return;

    try {
      const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Ingrédient supprimé avec succès !");
        fetchIngredients();
      }
    } catch (error: any) {
      console.error("Erreur lors de la suppression :", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <ShoppingBag className="mr-2 text-blue-400" /> Mes Ingrédients
        </h1>
        <SubNav tabs={tabs} onTabChange={() => {}} />

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <input
              type="text"
              placeholder="Rechercher un ingrédient..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full sm:w-auto p-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
              href="/aliments/ajouter"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="mr-2" size={18} /> Ajouter un Ingrédient
          </Link>
        </div>

        {editIngredient && (
            <div className="mt-6 p-4 bg-gray-800 rounded-md">
              <h2 className="text-lg font-semibold mb-2">Modifier l'ingrédient</h2>
              <form onSubmit={handleEditIngredient} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={editIngredient.nom}
                    onChange={(e) => setEditIngredient({ ...editIngredient, nom: e.target.value })}
                    className="p-2 border border-gray-700 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de l'ingrédient..."
                />
                <input
                    type="text"
                    value={editIngredient.unite}
                    onChange={(e) => setEditIngredient({ ...editIngredient, unite: e.target.value })}
                    className="p-2 border border-gray-700 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Unité (ex: g, ml)..."
                />
                <input
                    type="number"
                    value={editIngredient.prix_unitaire || ""}
                    onChange={(e) => setEditIngredient({ ...editIngredient, prix_unitaire: e.target.value ? parseFloat(e.target.value) : null })}
                    className="p-2 border border-gray-700 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Prix unitaire..."
                />
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Enregistrer
                </button>
                <button
                    type="button"
                    onClick={() => setEditIngredient(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Annuler
                </button>
              </form>
            </div>
        )}

        <div className="mt-6">
          {loading ? (
              <p className="text-center">Chargement...</p>
          ) : ingredients.length > 0 ? (
              <IngredientList ingredients={ingredients} onEdit={setEditIngredient} onDelete={handleDeleteIngredient} />
          ) : (
              <p className="text-center">Aucun ingrédient trouvé.</p>
          )}
        </div>

        {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-4">
              <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-500"
              >
                Précédent
              </button>
              <span className="text-gray-400">Page {page} sur {totalPages}</span>
              <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-500"
              >
                Suivant
              </button>
            </div>
        )}
      </div>
  );
}