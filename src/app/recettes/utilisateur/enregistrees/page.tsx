"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import RecetteList from "@/components/features/recettes/RecetteList";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";

interface PaginationResponse {
  recettes: any[];
  total: number;
  pages: number;
  current_page: number;
}

export default function RecettesEnregistreesPage() {
  const { user } = useAuth();
  const { data, error, loading, execute } = useApi<PaginationResponse>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) {
      execute(() =>
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recettes/saved`, {
          params: { page: 1, per_page: 10, titre: search },
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        })
      );
    }
  }, [search, execute, user]);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
      >
        <Bookmark className="mr-2 text-yellow-400 animate-pulse-slow" /> Recettes Enregistrées
      </motion.h1>
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une recette enregistrée..."
          className="w-full p-3 rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>
      {loading && (
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
          />
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {data && data.recettes.length > 0 && <RecetteList recettes={data.recettes} showSaveButton={true} />}
      {data && data.recettes.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 dark:text-gray-400 text-xl"
        >
          Aucune recette enregistrée disponible.
        </motion.p>
      )}
    </div>
  );
}