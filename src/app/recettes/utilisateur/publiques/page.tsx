// src/app/recettes/utilisateur/publiques/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { getRecettes } from "@/lib/api/recettes";
import RecetteList from "@/components/features/recettes/RecetteList";

interface PaginationResponse {
  recettes: any[];
  total: number;
  pages: number;
  current_page: number;
}

export default function RecettesPubliquesUtilisateurPage() {
  const { user } = useAuth();
  const { data, error, loading, execute } = useApi<PaginationResponse>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) {
      execute(() => getRecettes(1, 10, search, true, user.id_utilisateur));
    }
  }, [search, execute, user]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Mes Recettes Publiques</h2>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data && <RecetteList recettes={data.recettes} showSaveButton={false} />}
    </div>
  );
}