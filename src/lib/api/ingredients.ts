import axios from "axios";

interface Ingredient {
  id_ingredient: number;
  nom: string;
  unite?: string;
  prix_unitaire?: number;
}

interface PaginationResponse {
  ingredients: Ingredient[];
  total: number;
  pages: number;
  current_page: number;
}

export const getIngredients = async (
  page: number = 1,
  per_page: number = 10,
  search: string = "",
  token: string | null
): Promise<PaginationResponse> => {
  try {
    if (!token) {
      throw new Error("Token d'authentification manquant.");
    }
    const response = await axios.get<PaginationResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/ingredients`,
      {
        params: { page, per_page, search },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: unknown) { // Remplacé any par unknown
    console.error("Erreur lors de la récupération des ingrédients :", error);
    throw new Error((error as any)?.response?.data?.message || "Erreur lors de la récupération des ingrédients");
  }
};

export const getIngredientById = async (id: number, token: string | null): Promise<Ingredient> => {
  try {
    if (!token) {
      throw new Error("Token d'authentification manquant.");
    }
    const response = await axios.get<Ingredient>(
      `${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error((error as any)?.response?.data?.message || "Erreur lors de la récupération de l'ingrédient");
  }
};

export const createIngredient = async (ingredientData: {
  nom: string;
  unite?: string;
  prix_unitaire?: number;
}, token: string | null): Promise<Ingredient> => {
  try {
    if (!token) {
      throw new Error("Token d'authentification manquant.");
    }
    const response = await axios.post<Ingredient>(
      `${process.env.NEXT_PUBLIC_API_URL}/ingredients`,
      ingredientData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error((error as any)?.response?.data?.message || "Erreur lors de la création de l'ingrédient");
  }
};

export const updateIngredient = async (
  id: number,
  ingredientData: { nom: string; unite?: string; prix_unitaire?: number },
  token: string | null
): Promise<Ingredient> => {
  try {
    if (!token) {
      throw new Error("Token d'authentification manquant.");
    }
    const response = await axios.put<Ingredient>(
      `${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`,
      ingredientData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error((error as any)?.response?.data?.message || "Erreur lors de la mise à jour de l'ingrédient");
  }
};

export const deleteIngredient = async (id: number, token: string | null): Promise<void> => {
  try {
    if (!token) {
      throw new Error("Token d'authentification manquant.");
    }
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: unknown) {
    throw new Error((error as any)?.response?.data?.message || "Erreur lors de la suppression de l'ingrédient");
  }
};