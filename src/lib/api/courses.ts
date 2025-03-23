// src/lib/api/courses.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Course {
  id_liste: number;
  nom: string;
  date_creation?: string;
  id_utilisateur?: number;
  id_recette?: number | null;
  id_inventaire?: number | null;
  items: { id_item: number; id_ingredient: number; nom_ingredient: string; quantite: number; unite: string }[];
}

interface PaginationResponse {
  courses: Course[];
  total: number;
  pages: number;
  current_page: number;
}

interface ShoppingListItem {
  id_ingredient: number;
  nom: string;
  quantite_manquante: number;
  unite: string;
  prix_unitaire: number;
  cout: number;
}

interface ShoppingListResponse {
  liste_courses: ShoppingListItem[];
  total_cout: number;
}

// Fonction utilitaire pour générer les headers avec un token optionnel
const getAxiosConfig = (token?: string) => ({
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

// Récupérer toutes les listes de courses
export const getCourses = async (
  page: number = 1,
  per_page: number = 10,
  search: string = "",
  token?: string
): Promise<PaginationResponse> => {
  try {
    const response = await axios.get(`${API_URL}/courses`, {
      params: { page, per_page, search },
      ...getAxiosConfig(token),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Erreur lors de la récupération des courses";
      throw new Error(message);
    }
    throw new Error("Erreur inattendue lors de la récupération des courses");
  }
};

// Récupérer une liste de courses par ID
export const getCourseById = async (id: number, token?: string): Promise<Course> => {
  try {
    const response = await axios.get(`${API_URL}/courses/${id}`, getAxiosConfig(token));
    return response.data; // Ajuste si la réponse est sous une clé comme "liste"
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Erreur lors de la récupération de la liste de courses";
      throw new Error(message);
    }
    throw new Error("Erreur inattendue lors de la récupération de la liste de courses");
  }
};

// Créer une liste de courses
export const createCourse = async (
  courseData: {
    nom: string;
    id_recette?: number;
    items: { id_ingredient: number; quantite: number; unite: string }[];
  },
  token?: string
): Promise<Course> => {
  try {
    const response = await axios.post(`${API_URL}/courses`, courseData, getAxiosConfig(token));
    return response.data.liste; // Ajuste selon la structure réelle de la réponse
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Erreur inconnue";
      const details = error.response?.data?.details || "";
      throw new Error(`${message}${details ? `: ${details}` : ""}`);
    }
    throw new Error("Erreur inattendue lors de la création de la liste de courses");
  }
};

// Mettre à jour une liste de courses
export const updateCourse = async (
  id: number,
  courseData: { nom: string; quantite?: number; achete?: boolean },
  token?: string
): Promise<Course> => {
  try {
    const response = await axios.put(`${API_URL}/courses/${id}`, courseData, getAxiosConfig(token));
    return response.data.course; // Ajuste selon la structure réelle de la réponse
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la liste de courses";
      throw new Error(message);
    }
    throw new Error("Erreur inattendue lors de la mise à jour de la liste de courses");
  }
};

// Supprimer une liste de courses
export const deleteCourse = async (id: number, token?: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/courses/${id}`, getAxiosConfig(token));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la liste de courses";
      throw new Error(message);
    }
    throw new Error("Erreur inattendue lors de la suppression de la liste de courses");
  }
};

// Générer une liste de courses à partir d'un inventaire et d'une recette
export const generer_liste_courses = async (
  inventoryId: number,
  recipeId?: number,
  token?: string
): Promise<ShoppingListResponse> => {
  try {
    const response = await axios.get(`${API_URL}/inventaires/${inventoryId}/courses`, {
      ...getAxiosConfig(token),
      params: recipeId ? { id_recette: recipeId } : undefined,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Erreur lors de la génération de la liste de courses";
      throw new Error(message);
    }
    throw new Error("Erreur inattendue lors de la génération de la liste de courses");
  }
};