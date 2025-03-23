import axios from "axios";

interface Inventaire {
  id_inventaire: number;
  nom: string;
  aliments?: Aliment[];
}

interface PaginationResponse {
  inventaires: Inventaire[];
  total: number;
  pages: number;
  current_page: number;
}

export const getInventaires = async (
  page: number = 1,
  per_page: number = 10,
  search: string = ""
): Promise<PaginationResponse> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventaires`, {
    params: { page, per_page, search },
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data;
};

export const getInventaireById = async (id: number): Promise<Inventaire> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventaires/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
    return response.data.inventaire; // Ajouter .inventaire ici
  } catch (error) {
    // Gestion des erreurs...
  }
};

export const createInventaire = async (inventaireData: { nom: string }): Promise<Inventaire> => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inventaires`, inventaireData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data.inventaire;
};

export const updateInventaire = async (id: number, inventaireData: { nom: string }): Promise<Inventaire> => {
  const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/inventaires/${id}`, inventaireData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data.inventaire;
};

export const deleteInventaire = async (id: number): Promise<void> => {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/inventaires/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
};

export const addAlimentToInventaire = async (id: number, alimentData: { id_aliment: number; quantite?: number }): Promise<Inventaire> => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inventaires/${id}/ajouter-aliment`, alimentData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data.inventaire;
};