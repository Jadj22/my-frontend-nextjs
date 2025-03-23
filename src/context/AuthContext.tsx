"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login, register, refreshToken, logout } from "@/lib/api/auth"; // Supprimé getProfile
import { User } from "@/lib/types/auth"; // Supprimé AuthResponse
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";


interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loadingProfile: boolean;
  errorProfile: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nom: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const storedRefreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

      if (storedAccessToken && storedRefreshToken) {
        try {
          setToken(storedAccessToken);
          setIsAuthenticated(true);
          await fetchUserProfile();
        } catch (error) {
          console.error("Erreur lors de l’initialisation :", error);
          await refresh();
        }
      }
    };
    initializeAuth();

    const interval = setInterval(() => {
      if (isAuthenticated) {
        refresh();
      }
    }, 10 * 60 * 1000); // 10 minutes
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUserProfile, refresh]); // Ajouté fetchUserProfile et refresh

  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    setErrorProfile(null);
    try {
      const storedToken = localStorage.getItem("accessToken");
      if (!storedToken) {
        setErrorProfile("Aucun token d'authentification trouvé.");
        return;
      }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profil`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setUser(response.data.utilisateur);
    } catch (error: unknown) { // Remplacé any par unknown
      const err = error as any;
      if (err.response) {
        setErrorProfile(`Erreur ${err.response.status}: ${err.response.statusText} - ${err.response.data.message || ""}`);
        if (err.response.status === 401) {
          await refresh();
        }
      } else if (err.request) {
        setErrorProfile("Aucune réponse du serveur. Vérifiez NEXT_PUBLIC_API_URL.");
      } else {
        setErrorProfile(`Erreur: ${err.message}`);
      }
      console.error("Détails de l’erreur:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const refresh = async () => {
    const storedRefreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    if (!storedRefreshToken) {
      console.warn("Aucun token de rafraîchissement disponible");
      await handleLogout();
      return;
    }
    try {
      const { access_token } = await refreshToken(storedRefreshToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", access_token);
      }
      setToken(access_token);
      await fetchUserProfile();
      setIsAuthenticated(true);
    } catch (error: unknown) { // Remplacé any par unknown
      console.error("Erreur lors du rafraîchissement du token :", error);
      await handleLogout();
      toast.error("Session expirée, veuillez vous reconnecter.");
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await login(email, password);
      toast.success("Connexion réussie !");
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
      }
      setToken(data.access_token);
      setIsAuthenticated(true);
      await fetchUserProfile();
      setShowLoginModal(false);
      router.push("/recettes");
    } catch (error: unknown) { // Remplacé any par unknown
      const err = error as any;
      toast.error("Erreur lors de la connexion : " + (err.response?.data?.message || err.message));
      throw error;
    }
  };

  const handleRegister = async (email: string, password: string, nom: string) => {
    try {
      const data = await register(email, password, nom);
      toast.success("Inscription réussie !");
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
      }
      setToken(data.access_token);
      setIsAuthenticated(true);
      await fetchUserProfile();
      setShowLoginModal(false);
      router.push("/recettes");
    } catch (error: unknown) { // Remplacé any par unknown
      const err = error as any;
      toast.error("Erreur lors de l’inscription : " + (err.response?.data?.message || err.message));
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      toast.success("Déconnexion réussie !");
      router.push("/");
    } catch (error: unknown) { // Remplacé any par unknown
      const err = error as any;
      toast.error("Erreur lors de la déconnexion : " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loadingProfile,
        errorProfile,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refresh,
        fetchUserProfile,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};