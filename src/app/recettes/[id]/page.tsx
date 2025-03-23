"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRecetteById, getSuggestions } from "@/lib/api/recettes";
import { Recette, Ingredient, Etape } from "@/lib/api/recettes";
import axios from "axios";
import Link from "next/link";
import RecetteCard from "@/components/features/recettes/RecetteCard";
import { BookOpen, Clock, User, Trash2, Edit2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

export default function RecetteDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [recette, setRecette] = useState<Recette | null>(null);
  const [suggestions, setSuggestions] = useState<Recette[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
    
        const token = localStorage.getItem("accessToken");
        const recetteData = await getRecetteById(Number(id), token); // Passe le token ici
        setRecette(recetteData);
    
        let currentUserId: number | null = null;
        if (token) {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profil`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          currentUserId = response.data.utilisateur.id_utilisateur;
          setIsOwner(currentUserId === recetteData.id_utilisateur);
        }
    
        // Charger les suggestions uniquement pour les recettes publiques d'autres utilisateurs
        if (recetteData.publique && (!token || currentUserId !== recetteData.id_utilisateur)) {
          const suggestionsData = await getSuggestions(4, token); // Passe le token ici aussi si nécessaire
          const filteredSuggestions = suggestionsData.filter((r) => r.id_recette !== Number(id));
          setSuggestions(filteredSuggestions.slice(0, 4));
        } else {
          setSuggestions([]);
        }
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setError("Accès non autorisé : vous n’avez pas la permission de voir cette recette.");
        } else if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError("Session expirée. Veuillez vous reconnecter.");
          router.push("/auth/connexion");
        } else {
          setError(err.message || "Une erreur s'est produite lors du chargement des données.");
        }
        console.error("Erreur :", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette recette ?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/recettes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Recette supprimée avec succès !", { duration: 3000 });
      router.push("/recettes");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la suppression.", { duration: 4000 });
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const coutTotal = recette?.ingredients.reduce((total, ingredient) => {
    return ingredient.prix_unitaire && ingredient.quantite
      ? total + ingredient.prix_unitaire * (ingredient.quantite / 100)
      : total;
  }, 0) || 0;

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
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => router.push("/recettes")}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <ArrowLeft size={20} /> Retour
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="shadow-lg rounded-xl p-6 border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        >
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <BookOpen className="mr-2 text-blue-500 dark:text-blue-400" />
            {recette.titre}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span className="flex items-center">
              <User className="mr-1" size={16} />
              Par {recette.createur}
            </span>
            <span>Créée le {new Date(recette.date_creation).toLocaleDateString("fr-FR")}</span>
          </div>

          {recette.imageUrl ? (
            <img
              src={recette.imageUrl}
              alt={recette.titre}
              className="w-full h-64 object-cover mb-6 rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center mb-6 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              <span>Aucune image disponible</span>
            </div>
          )}

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Description</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {recette.description || "Aucune description disponible."}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-200">
              <Clock className="mr-2" />
              Temps
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Préparation : {recette.temps_preparation || "Non spécifié"} min | Cuisson :{" "}
              {recette.temps_cuisson || "Non spécifié"} min
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Ingrédients</h2>
            {recette.ingredients.length > 0 ? (
              <>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                  {recette.ingredients.map((ingredient: Ingredient, index: number) => (
                    <li key={index} className="mb-1">
                      {ingredient.quantite} {ingredient.unite} {ingredient.nom}
                      {ingredient.prix_unitaire && (
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          {" "} - {(ingredient.prix_unitaire * (ingredient.quantite / 100)).toFixed(2)} €
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {coutTotal > 0 && (
                  <p className="mt-2 font-semibold text-gray-600 dark:text-gray-300">
                    Coût total estimé : {coutTotal.toFixed(2)} €
                  </p>
                )}
              </>
            ) : (
              <p className="italic text-gray-500 dark:text-gray-400">Aucun ingrédient spécifié.</p>
            )}
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Étapes</h2>
            {recette.etapes.length > 0 ? (
              <ol className="list-decimal pl-5 text-gray-600 dark:text-gray-300">
                {recette.etapes.map((etape: Etape, index: number) => (
                  <li key={index} className="mb-2">{etape.instruction}</li>
                ))}
              </ol>
            ) : (
              <p className="italic text-gray-500 dark:text-gray-400">Aucune étape spécifiée.</p>
            )}
          </section>

          {isOwner && (
            <div className="flex justify-end space-x-3">
              <Link
                href={`/recettes/${id}/modifier`}
                className="px-4 py-2 text-white rounded-md transition-all shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
              >
                <Edit2 className="inline mr-2" size={16} />
                Modifier
              </Link>
              <Button
                variant="danger"
                onClick={handleDelete}
                className="px-4 py-2 text-white rounded-md transition-all shadow-md bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
              >
                <Trash2 className="inline mr-2" size={16} />
                Supprimer
              </Button>
            </div>
          )}
        </motion.div>

        {/* Suggestions (affichées uniquement si la recette est publique et n'appartient pas à l'utilisateur) */}
        {recette.publique && !isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Autres Recettes Publiques</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <RecetteCard key={suggestion.id_recette} recette={suggestion} showSaveButton={true} />
                ))
              ) : (
                <p className="italic col-span-full text-gray-500 dark:text-gray-400">
                  Aucune autre recette publique disponible.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}