import axios from "axios";

interface Inventaire {
  id_inventaire: number;
  nom: string;
  publique: boolean;
  id_utilisateur: number;
  ingredients: InventaireIngredient[];
}

interface InventaireIngredient {
  id_inventaire_ingredient: number;
  id_inventaire: number;
  id_ingredient: number;
  nom_ingredient: string;
  quantite_disponible: number;
  unite: string;
  prix_unitaire: number | null;
}

export const getInventaires = async (
  page: number = 1,
  perPage: number = 10,
  search: string = "",
  token: string | null
): Promise<{ inventaires: Inventaire[] }> => {
  try {
    if (!token) {
      throw new Error("Token d'authentification manquant.");
    }
    const response = await axios.get<{ inventaires: Inventaire[] }>(
      `${process.env.NEXT_PUBLIC_API_URL}/inventaires`,
      {
        params: { page, per_page: perPage, search },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch { // Supprimé error inutilisé
    throw new Error("Erreur lors de la récupération des inventaires");
  }
};

// Autres fonctions possibles dans ce fichier (exemple)
export const getInventaireById = async (id: number, token: string | null): Promise<Inventaire> => {
  try {
    if (!token) {
      throw new Error("Token d'authentification manquant.");
    }
    const response = await axios.get<{ inventaire: Inventaire }>(
      `${process.env.NEXT_PUBLIC_API_URL}/inventaires/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.inventaire;
  } catch (error: unknown) {
    throw new Error((error as any)?.response?.data?.message || "Erreur lors de la récupération de l'inventaire");
  }
};

export const createInventaire = async (data: { nom: string }, token: string | null): Promise<Inventaire> => {
  try {
    if (!token) {
      throw new Error("Token d'authentification manquant.");
    }
    const response = await axios.post<{ inventaire: Inventaire }>(
      `${process.env.NEXT_PUBLIC_API_URL}/inventaires`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.inventaire;
  } catch (error: unknown) {
    throw new Error((error as any)?.response?.data?.message || "Erreur lors de la création de l'inventaire");
  }
};