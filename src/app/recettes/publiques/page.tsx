"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { getAllPublicRecettes } from "@/lib/api/recettes"; // Corrected import
import RecetteList from "@/components/features/recettes/RecetteList";
import SearchBar from "@/components/ui/SearchBar";
import { Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";

interface PaginationResponse {
  recettes: Recette[];
  total: number;
  pages: number;
  current_page: number;
}

interface Recette {
  id_recette: number;
  titre: string;
  description: string | null; // Nullable comme dans le backend
  publique: boolean;
  id_utilisateur: number;
  createur?: string; // Correspond à "createur" dans to_dict()
  imageUrl?: string | null; // Nullable comme dans le backend
  date_creation?: string; // Aligné avec "date_creation" du backend
}

export default function RecettesPubliquesPage() {
  const { data, error, loading, execute } = useApi<PaginationResponse>();
  const { isAuthenticated, login, register } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Utilisation de getPublicRecettes pour toutes les recettes publiques
    execute(() => getAllPublicRecettes(page, 10, search));
  }, [search, page, execute]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (isLogin) {
        await login(email, password);
        router.push("/recettes");
      } else {
        await register(email, password, name);
        router.push("/recettes");
      }
      setShowAuthModal(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setAuthError("Une erreur est survenue. Vérifiez vos informations ou essayez à nouveau.");
    }
  };

  const handleDetailClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return false; // Bloque la navigation
    }
    return true; // Autorise la navigation
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 flex items-center text-gray-800 dark:text-gray-100">
        <Globe className="mr-2 text-blue-500 dark:text-blue-400" /> Recettes Publiques
      </h1>
      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Rechercher une recette publique..."
          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
      </div>
      {loading && <p className="text-center text-gray-500 dark:text-gray-400">Chargement...</p>}
      {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
      {data && data.recettes.length > 0 ? (
        <>
          <RecetteList recettes={data.recettes} showSaveButton={true} onDetailClick={handleDetailClick} />
          {data.pages > 1 && (
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-gray-600"
              >
                Précédent
              </Button>
              <span className="text-gray-600 dark:text-gray-300">
                Page {page} sur {data.pages}
              </span>
              <Button
                onClick={() => setPage((prev) => Math.min(prev + 1, data.pages))}
                disabled={page === data.pages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-gray-600"
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      ) : !loading && !error ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Aucune recette publique disponible.</p>
      ) : null}

      {/* Modal d'authentification */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full"
            >
              <div className="flex items-center justify-center mb-6">
                <Globe size={40} className="text-blue-600 dark:text-blue-400 mr-2 animate-pulse-slow" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLogin ? "Connexion" : "Inscription"}
                </h3>
              </div>
              <form onSubmit={handleAuthSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Votre nom"
                      className="mt-2 w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="mt-2 w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mot de passe
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {authError && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{authError}</p>}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-lg font-semibold dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isLogin ? "Se connecter" : "S'inscrire"}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isLogin ? "Pas de compte ?" : "Déjà un compte ?"}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    {isLogin ? "S'inscrire" : "Se connecter"}
                  </button>
                </p>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="mt-2 text-sm text-red-500 dark:text-red-400 hover:underline"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}