// src/app/recettes/page.tsx
"use client";
import { useState, useEffect } from "react";
import SubNav from "@/components/layout/SubNav";
import { Book } from "lucide-react";
import RecetteCard from "@/components/features/recettes/RecetteCard";
import { getRecettes, getSavedRecettes, PaginationResponse } from "@/lib/api/recettes";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Recette {
  id_recette: number;
  titre: string;
  description: string;
  publique: boolean;
  id_utilisateur: number;
  nom_utilisateur?: string;
  imageUrl?: string;
  created_at?: string;
  date_creation?: string;
  createur?: string;
}

export default function RecettesUtilisateurLayout() {
  const { isAuthenticated, user, loadingProfile, errorProfile } = useAuth();
  const router = useRouter();
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [filteredRecettes, setFilteredRecettes] = useState<Recette[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Publiques");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { name: "Publiques", href: "/recettes", active: activeTab === "Publiques" },
    { name: "Privées", href: "/recettes", active: activeTab === "Privées" },
    { name: "Enregistrées", href: "/recettes", active: activeTab === "Enregistrées" },
  ];

  useEffect(() => {
    if (!isAuthenticated && !loadingProfile) {
      router.push("/");
    } else if (isAuthenticated && !loadingProfile && !errorProfile) {
      fetchRecettes();
    }
  }, [isAuthenticated, loadingProfile, errorProfile, router, page, activeTab]);

  const fetchRecettes = async () => {
    try {
      setLoading(true);
      const id_utilisateur = user?.id_utilisateur;
      console.log("ID Utilisateur pour recettes:", id_utilisateur);
  
      if (!id_utilisateur) {
        console.warn("Aucun ID utilisateur disponible.");
        router.push("/");
        return;
      }
  
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("Token manquant dans localStorage");
        router.push("/auth/connexion");
        return;
      }
  
      let response: PaginationResponse;
  
      if (activeTab === "Enregistrées") {
        response = await getSavedRecettes(page, 10, searchTerm, token);
      } else {
        const filters: { titre?: string; owner?: boolean; publique?: boolean } = { titre: searchTerm };
        if (activeTab === "Privées") {
          filters.owner = true; // /recettes/privees
        } else if (activeTab === "Publiques") {
          filters.publique = true; // /recettes/publiques
        }
        response = await getRecettes(page, 10, filters, token);
      }
  
      if (!Array.isArray(response.recettes)) {
        console.error("Les données récupérées ne sont pas un tableau :", response.recettes);
        setRecettes([]);
        setFilteredRecettes([]);
        return;
      }
  
      console.log("Recettes récupérées :", response.recettes);
      setRecettes(response.recettes);
      setTotalPages(response.pages);
      setFilteredRecettes(response.recettes);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des recettes :", error);
      if (error.message === "Token invalide") {
        alert("Session expirée. Veuillez vous reconnecter.");
        router.push("/auth/connexion");
      }
      setRecettes([]);
      setFilteredRecettes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    setPage(1);
  };

  const handleUnsave = () => {
    fetchRecettes();
  };

  const showSaveButton = activeTab === "Enregistrées";
  const isSavedView = activeTab === "Enregistrées";

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
    fetchRecettes();
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
      >
        <Book className="mr-2 text-yellow-400 animate-pulse-slow" /> Mes Recettes
      </motion.h1>
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Rechercher une recette..."
          className="w-full p-3 rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>
      <SubNav tabs={tabs} onTabChange={handleTabChange} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-8"
      >
        {loading ? (
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
            />
          </div>
        ) : filteredRecettes.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRecettes.map((recette) => (
              <motion.div
                key={recette.id_recette}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <RecetteCard
                  recette={recette}
                  showSaveButton={showSaveButton}
                  isSavedView={isSavedView}
                  onUnsave={handleUnsave}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 dark:text-gray-400 text-xl"
          >
            Aucune recette disponible.
          </motion.p>
        )}
      </motion.div>
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-full disabled:bg-gray-400 transition-all duration-300"
          >
            Précédent
          </motion.button>
          <span className="text-gray-600 dark:text-gray-400 text-lg">
            Page {page} sur {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-full disabled:bg-gray-400 transition-all duration-300"
          >
            Suivant
          </motion.button>
        </div>
      )}
    </div>
  );
}