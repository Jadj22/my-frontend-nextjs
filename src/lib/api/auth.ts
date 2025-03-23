import axios from "axios";

interface User {
  id_utilisateur: number;
  email: string;
  nom: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  utilisateur: User;
}

// Fonction utilitaire pour vérifier les en-têtes
const getAuthHeaders = (token: string | null) => {
  if (!token) {
    throw new Error("Aucun token d'accès disponible");
  }
  return { Authorization: `Bearer ${token}` };
};

export const register = async (
  email: string,
  password: string,
  nom: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/inscription`, {
      email,
      mot_de_passe: password,
      nom,
    });
    return response.data as AuthResponse;
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/connexion`, {
      email,
      mot_de_passe: password,
    });
    return response.data as AuthResponse;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error.response?.data || error.message);
    throw error;
  }
};

export const refreshToken = async (refreshToken: string): Promise<{ access_token: string }> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      null,
      {
        headers: getAuthHeaders(refreshToken),
      }
    );
    return response.data as { access_token: string };
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token :", error.response?.data || error.message);
    throw error;
  }
};

export const getProfile = async (): Promise<User> => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Aucun token disponible");
  }
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profil`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.utilisateur;
};

export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("accessToken");
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/deconnexion`, null, {
      headers: getAuthHeaders(token),
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error.response?.data || error.message);
    throw error;
  }
};