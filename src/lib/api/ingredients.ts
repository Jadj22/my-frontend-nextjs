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
  search: string = ""
): Promise<PaginationResponse> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token d'authentification manquant. Veuillez vous connecter.");
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`, {
      params: { page, per_page, search },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des ingrédients :", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erreur lors de la récupération des ingrédients");
  }
};

export const getIngredientById = async (id: number): Promise<Ingredient> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data.ingredient; // Le backend renvoie {"ingredient": {...}}
};

export const createIngredient = async (ingredientData: { nom: string; unite?: string; prix_unitaire?: number }): Promise<Ingredient> => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`, ingredientData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data.ingredient; // Le backend renvoie {"ingredient": {...}}
};

export const updateIngredient = async (id: number, ingredientData: { nom: string; unite?: string; prix_unitaire?: number }): Promise<Ingredient> => {
  const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`, ingredientData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data.ingredient; // Le backend renvoie {"ingredient": {...}}
};

export const deleteIngredient = async (id: number): Promise<void> => {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
};