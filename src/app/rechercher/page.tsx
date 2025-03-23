// src/app/rechercher/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Book, Utensils, ShoppingCart, Package } from "lucide-react";

interface SearchResult {
  type: "recette" | "ingredient" | "course" | "inventaire";
  id: number;
  nom: string;
  description?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rechercher`, {
          params: { q: query },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setResults(response.data.results);
      } catch (err) {
        setError("Erreur lors de la recherche");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "recette":
        return <Book className="text-blue-600" size={20} />;
      case "ingredient":
        return <Utensils className="text-green-600" size={20} />;
      case "course":
        return <ShoppingCart className="text-purple-600" size={20} />;
      case "inventaire":
        return <Package className="text-orange-600" size={20} />;
      default:
        return null;
    }
  };

  const getLink = (result: SearchResult) => {
    switch (result.type) {
      case "recette":
        return `/recettes/${result.id}`;
      case "ingredient":
        return `/aliments/${result.id}`;
      case "course":
        return `/courses/${result.id}`;
      case "inventaire":
        return `/inventaires/${result.id}`;
      default:
        return "#";
    }
  };

  return (
    <div className="container mx-auto p-6 pt-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Résultats de recherche pour : "{query}"
      </h1>
      {loading && <p className="text-gray-500">Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && query && (
        <p className="text-gray-500">Aucun résultat trouvé pour "{query}".</p>
      )}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={getLink(result)}
              className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                {getIcon(result.type)}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{result.nom}</h2>
                  {result.description && (
                    <p className="text-gray-600 text-sm">{result.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}