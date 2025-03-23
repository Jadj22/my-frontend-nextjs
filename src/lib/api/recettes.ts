import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Ingredient {
  id_ingredient: number;
  nom: string;
  quantite?: number;
  prix_unitaire: number | null;
  unite?: string;
}

export interface Etape {
  id_etape: number;
  ordre: number;
  instruction: string;
}

export interface Recette {
  id_recette: number;
  titre: string;
  description: string | null;
  date_creation: string;
  id_utilisateur: number;
  publique: boolean;
  temps_preparation: number | null;
  temps_cuisson: number | null;
  ingredients?: Ingredient[]; // Optionnel car pas toujours renvoyé
  etapes?: Etape[]; // Optionnel car pas toujours renvoyé
  createur: string;
  imageUrl?: string | null;
}

interface PaginationResponse {
  recettes: Recette[];
  total: number;
  pages: number;
  current_page: number;
}

const getAxiosConfig = (token?: string) => ({
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

// Interface pour les données envoyées lors de la création/mise à jour
interface RecetteData {
  titre: string;
  description?: string;
  publique?: boolean;
  temps_preparation?: number;
  temps_cuisson?: number;
  ingredients?: { nom: string; quantite: number; unite: string }[];
  etapes?: { ordre?: number; instruction: string }[];
}

export const getRecettes = async (
  page: number = 1,
  per_page: number = 10,
  filters: { titre?: string; owner?: boolean; publique?: boolean } = {},
  token?: string
): Promise<PaginationResponse> => {
  try {
    let url = `${API_URL}/recettes`;
    if (filters.owner) {
      url = `${API_URL}/recettes/privees`; // Privées uniquement
    } else if (filters.publique) {
      url = `${API_URL}/recettes/publiques`; // Publiques de l'utilisateur
    }
    const response = await axios.get(url, {
      params: { page, per_page, titre: filters.titre || undefined, publique: filters.publique },
      ...getAxiosConfig(token),
    });
    const data = response.data as PaginationResponse;
    if (!Array.isArray(data.recettes)) {
      console.error("La réponse ne contient pas un tableau de recettes :", data);
      return { recettes: [], total: 0, pages: 1, current_page: page };
    }
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Erreur lors de la récupération des recettes");
    }
    throw new Error("Erreur inattendue lors de la récupération des recettes");
  }
};

export const getAllPublicRecettes = async (
  page: number = 1,
  per_page: number = 10,
  titre: string = ""
): Promise<PaginationResponse> => {
  try {
    const response = await axios.get(`${API_URL}/recettes/public`, {
      params: { page, per_page, titre: titre || undefined },
    });
    const data = response.data as PaginationResponse;
    if (!Array.isArray(data.recettes)) {
      console.error("La réponse ne contient pas un tableau de recettes :", data);
      return { recettes: [], total: 0, pages: 1, current_page: page };
    }
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Erreur lors de la récupération des recettes publiques");
    }
    throw new Error("Erreur inattendue lors de la récupération des recettes publiques");
  }
};

export const getRecetteById = async (id: number, token?: string): Promise<Recette> => {
  try {
    const response = await axios.get(`${API_URL}/recettes/${id}`, getAxiosConfig(token));
    return response.data.recette;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Erreur lors de la récupération de la recette");
    }
    throw new Error("Erreur inattendue lors de la récupération de la recette");
  }
};

export const createRecette = async (recetteData: RecetteData, token?: string): Promise<Recette> => {
  try {
    const response = await axios.post(`${API_URL}/recettes`, recetteData, getAxiosConfig(token));
    return response.data.recette;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Erreur lors de la création de la recette");
    }
    throw new Error("Erreur inattendue lors de la création de la recette");
  }
};

export const updateRecette = async (id: number, recetteData: RecetteData, token?: string): Promise<Recette> => {
  try {
    const response = await axios.put(`${API_URL}/recettes/${id}`, recetteData, getAxiosConfig(token));
    return response.data.recette;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Erreur lors de la mise à jour de la recette");
    }
    throw new Error("Erreur inattendue lors de la mise à jour de la recette");
  }
};

export const deleteRecette = async (id: number, token?: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/recettes/${id}`, getAxiosConfig(token));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Erreur lors de la suppression de la recette");
    }
    throw new Error("Erreur inattendue lors de la suppression de la recette");
  }
};

export const getSuggestions = async (limit: number = 4, token?: string): Promise<Recette[]> => {
  try {
    const response = await axios.get(`${API_URL}/recettes/suggestions`, {
      params: { limit },
      ...getAxiosConfig(token),
    });
    return response.data.recettes || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Erreur lors de la récupération des suggestions");
    }
    throw new Error("Erreur inattendue lors de la récupération des suggestions");
  }
};

export const getSavedRecettes = async (
  page: number = 1,
  per_page: number = 10,
  titre: string = "",
  token?: string
): Promise<PaginationResponse> => {
  try {
    const response = await axios.get(`${API_URL}/recettes/enregistrées`, {
      params: { page, per_page, titre: titre || undefined },
      ...getAxiosConfig(token),
    });
    const data = response.data as PaginationResponse;
    if (!Array.isArray(data.recettes)) {
      console.error("La réponse ne contient pas un tableau de recettes :", data);
      return { recettes: [], total: 0, pages: 1, current_page: page };
    }
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Erreur lors de la récupération des recettes enregistrées");
    }
    throw new Error("Erreur inattendue lors de la récupération des recettes enregistrées");
  }
};