"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import SubNav from "@/components/layout/SubNav";
import { Package, Edit, Trash, Plus, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField"; // Added the missing import

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

export default function InventairesLayout() {
  const [inventaires, setInventaires] = useState<Inventaire[]>([]);
  const [filteredInventaires, setFilteredInventaires] = useState<Inventaire[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editInventaire, setEditInventaire] = useState<Inventaire | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  const tabs = [{ name: "Mes Inventaires", href: "/inventaires", active: true }];

  useEffect(() => {
    if (!token) {
      toast.error("Veuillez vous connecter pour accéder aux inventaires.");
      router.push("/connexion");
      return;
    }
    fetchInventaires();
  }, [token, router]);

  const fetchInventaires = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ inventaires: Inventaire[] }>(
          `${process.env.NEXT_PUBLIC_API_URL}/inventaires`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setInventaires(response.data.inventaires);
      setFilteredInventaires(response.data.inventaires);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la récupération des inventaires.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search/filter functionality
  useEffect(() => {
    const filtered = inventaires.filter((inv) =>
        inv.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInventaires(filtered);
  }, [searchQuery, inventaires]);

  const handleEditInventaire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInventaire) return;
    try {
      const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/inventaires/${editInventaire.id_inventaire}`,
          { nom: editInventaire.nom },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Inventaire modifié avec succès !", { duration: 3000 });
        setEditInventaire(null);
        fetchInventaires();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la modification.", {
        duration: 4000,
      });
    }
  };

  const handleDeleteInventaire = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet inventaire ?")) return;
    try {
      const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/inventaires/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("Inventaire supprimé avec succès !", { duration: 3000 });
        fetchInventaires();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression.", {
        duration: 4000,
      });
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-6 flex items-center animate-fade-in">
            <Package className="mr-2 text-blue-500 dark:text-blue-400" size={30} />
            Mes Inventaires
          </h1>
          <SubNav tabs={tabs} onTabChange={() => {}} />

          {/* Search and Create Button */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-1/3">
              <InputField
                  label="Rechercher"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un inventaire..."
                  disabled={loading}
              />
            </div>
            <Link
                href="/inventaires/creer"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="mr-2" size={18} />
              Créer un Inventaire
            </Link>
          </div>

          {/* Edit Modal */}
          {editInventaire && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                      Modifier l'inventaire
                    </h2>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditInventaire(null)}
                        aria-label="Fermer"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <form onSubmit={handleEditInventaire} className="space-y-4">
                    <InputField
                        label="Nom de l'inventaire"
                        id="edit-nom"
                        value={editInventaire.nom}
                        onChange={(e) => setEditInventaire({ ...editInventaire, nom: e.target.value })}
                        placeholder="Nom de l'inventaire"
                        required
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => setEditInventaire(null)}>
                        Annuler
                      </Button>
                      <Button variant="primary" type="submit">
                        Enregistrer
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
          )}

          {/* Inventories List */}
          <div className="mt-8">
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, index) => (
                      <div
                          key={index}
                          className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-md animate-pulse"
                      >
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                  ))}
                </div>
            ) : filteredInventaires.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInventaires.map((inv) => (
                      <div
                          key={inv.id_inventaire}
                          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                      >
                        <Link href={`/inventaires/${inv.id_inventaire}`}>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                            {inv.nom}
                          </h3>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Ingrédients: {inv.ingredients.length}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Statut: {inv.publique ? "Public" : "Privé"}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setEditInventaire(inv)}
                              aria-label="Modifier l'inventaire"
                              title="Modifier"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteInventaire(inv.id_inventaire)}
                              aria-label="Supprimer l'inventaire"
                              title="Supprimer"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Aucun inventaire trouvé.
                </p>
            )}
          </div>
        </div>
      </div>
  );
}