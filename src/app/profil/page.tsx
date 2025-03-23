"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Edit, Save } from "lucide-react";
import DefaultBreadcrumb from "@/components/layout/DefaultBreadcrumb";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface UserProfile {
  id: number;
  email: string;
  nom: string;
  mot_de_passe?: string;
}

export default function ProfilePage() {
  const { user, token, fetchUserProfile } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nom: "", mot_de_passe: "", confirm_mot_de_passe: "" });

  useEffect(() => {
    const fetchUserProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) {
          setError("Aucun token d'authentification trouvé.");
          return;
        }
        // Adjusted to /auth/profil assuming a prefix
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = response.data.utilisateur;
        setUserProfile(profile);
        setEditData({ nom: profile.nom, mot_de_passe: "", confirm_mot_de_passe: "" });
      } catch (err) {
        setError("Erreur lors de la récupération du profil");
        console.error("Fetch error details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileData();
  }, [token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!token || !userProfile) return;

    if (!editData.nom.trim()) {
      toast.error("Le nom est requis.");
      return;
    }
    if (editData.mot_de_passe && editData.mot_de_passe.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (editData.mot_de_passe !== editData.confirm_mot_de_passe) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const payload = { nom: editData.nom };
      if (editData.mot_de_passe) payload["mot_de_passe"] = editData.mot_de_passe;

      const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profil`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Profil mis à jour avec succès !");
        setUserProfile({ ...userProfile, nom: editData.nom });
        setIsEditing(false);
        await fetchUserProfile();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la mise à jour du profil.");
      console.error("Save error details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setEditData({ nom: userProfile.nom, mot_de_passe: "", confirm_mot_de_passe: "" });
    }
    setIsEditing(false);
  };

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 pt-20 md:ml-64">
        <div className="max-w-2xl mx-auto">
          <DefaultBreadcrumb />
          <h1 className="text-3xl font-bold mb-6 flex items-center animate-fade-in">
            <User className="mr-2 text-blue-500 dark:text-blue-400" size={30} />
            Mon Profil
          </h1>

          {loading && <p className="text-center text-gray-500 dark:text-gray-400">Chargement...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {userProfile && !loading && !error && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <User size={32} className="text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                      {userProfile.email}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">ID: {userProfile.id}</p>
                  </div>
                </div>

                {!isEditing ? (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail size={20} className="text-gray-600 dark:text-gray-400" />
                          <p className="text-gray-800 dark:text-gray-200">
                            Email: <span className="font-medium">{userProfile.email}</span>
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <User size={20} className="text-gray-600 dark:text-gray-400" />
                          <p className="text-gray-800 dark:text-gray-200">
                            Nom: <span className="font-medium">{userProfile.nom}</span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button variant="secondary" onClick={handleEdit}>
                          <Edit size={16} className="mr-2" /> Modifier
                        </Button>
                      </div>
                    </>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                      <InputField
                          label="Nom"
                          id="nom"
                          value={editData.nom}
                          onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                          placeholder="Entrez votre nom"
                          required
                      />
                      <InputField
                          label="Nouveau mot de passe (optionnel)"
                          id="mot_de_passe"
                          type="password"
                          value={editData.mot_de_passe}
                          onChange={(e) => setEditData({ ...editData, mot_de_passe: e.target.value })}
                          placeholder="Laissez vide pour ne pas changer"
                      />
                      <InputField
                          label="Confirmer le mot de passe"
                          id="confirm_mot_de_passe"
                          type="password"
                          value={editData.confirm_mot_de_passe}
                          onChange={(e) => setEditData({ ...editData, confirm_mot_de_passe: e.target.value })}
                          placeholder="Confirmez le nouveau mot de passe"
                      />
                      <div className="flex gap-3">
                        <Button variant="primary" type="submit" disabled={loading}>
                          {loading ? (
                              <span className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Enregistrement...
                      </span>
                          ) : (
                              <>
                                <Save size={16} className="mr-2" /> Enregistrer
                              </>
                          )}
                        </Button>
                        <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                          Annuler
                        </Button>
                      </div>
                    </form>
                )}
              </div>
          )}
        </div>
      </div>
  );
}