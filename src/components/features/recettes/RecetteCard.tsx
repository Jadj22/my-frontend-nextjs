"use client";
import Link from "next/link";
import { Book, User, BookMarked } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

interface Recette {
  id_recette: number;
  titre: string;
  description: string;
  publique: boolean;
  id_utilisateur: number;
  imageUrl?: string;
  created_at?: string;
  date_creation?: string;
  createur?: string;
}

interface RecetteCardProps {
  recette: Recette;
  showSaveButton?: boolean;
  isSavedView?: boolean;
  onUnsave?: (id_recette: number) => void;
  onDetailClick?: () => boolean; // Nouvelle prop
}

export default function RecetteCard({
  recette,
  showSaveButton = true,
  isSavedView = false,
  onUnsave,
  onDetailClick,
}: RecetteCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isCheckingOwner, setIsCheckingOwner] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const checkOwnership = async () => {
      if (!token) {
        setIsOwner(false);
        setIsCheckingOwner(false);
        return;
      }
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUserId = Number(response.data.utilisateur.id_utilisateur);
        setIsOwner(currentUserId === Number(recette.id_utilisateur));
      } catch (err) {
        console.error("Erreur lors de la récupération du profil utilisateur :", err);
        setIsOwner(false);
      } finally {
        setIsCheckingOwner(false);
      }
    };
    checkOwnership();
  }, [recette.id_utilisateur, token]);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!token || isOwner) {
        setIsSaved(false);
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/recettes/verifier-enregistrement/${recette.id_recette}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSaved(response.data.isSaved);
      } catch (err) {
        console.error("Erreur lors de la vérification de l'enregistrement :", err);
        setIsSaved(false);
      }
    };
    checkIfSaved();
  }, [recette.id_recette, token, isOwner]);

  const handleSave = async () => {
    if (!token) {
      alert("Veuillez vous connecter pour enregistrer une recette.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/recettes/${recette.id_recette}/enregistrer`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        setIsSaved(true);
        alert("Recette enregistrée avec succès !");
      }
    } catch (err: any) {
      console.error("Erreur lors de l'enregistrement :", err);
      if (err.response?.status === 400) {
        alert("Recette déjà enregistrée.");
        setIsSaved(true);
      } else if (err.response?.status === 403) {
        alert("Cette recette n’est pas publique.");
      } else {
        alert("Erreur lors de l'enregistrement de la recette.");
      }
    }
  };

  const handleUnsave = async () => {
    if (!token) {
      alert("Veuillez vous connecter pour désenregistrer une recette.");
      return;
    }
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/recettes/${recette.id_recette}/enregistrer`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setIsSaved(false);
        alert("Recette désenregistrée avec succès !");
        if (onUnsave) onUnsave(recette.id_recette);
      }
    } catch (err: any) {
      console.error("Erreur lors du désenregistrement :", err);
      if (err.response?.status === 404) {
        alert("Recette non enregistrée.");
        setIsSaved(false);
      } else {
        alert("Erreur lors du désenregistrement de la recette.");
      }
    }
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    if (onDetailClick && !onDetailClick()) {
      e.preventDefault(); // Empêche la navigation si non connecté
    }
  };

  const displayDate = recette.created_at || recette.date_creation;

  if (isCheckingOwner) {
    return <div className="text-gray-500 dark:text-gray-400">Chargement...</div>;
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md transition-all duration-300 overflow-hidden hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full">
        {recette.imageUrl ? (
          <Image src={recette.imageUrl} alt={recette.titre} layout="fill" objectFit="cover" className="rounded-t-xl" />
        ) : (
          <div className="h-full w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-t-xl">
            <Book className="text-gray-400 dark:text-gray-500" size={40} />
          </div>
        )}
        <span
          className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full ${
            recette.publique ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {recette.publique ? "Publique" : "Privée"}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center mb-2">
          <Book className="mr-2 text-blue-500 dark:text-blue-400" size={20} />
          {recette.titre}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">{recette.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <User className="mr-1" size={16} />
            <span>Par {recette.createur || "Inconnu"}</span>
          </div>
          {displayDate && <span>{new Date(displayDate).toLocaleDateString("fr-FR")}</span>}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <Link
            href={`/recettes/${recette.id_recette}`}
            onClick={handleDetailClick}
            className="w-full sm:w-auto inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors duration-200 text-center"
          >
            Voir détails
          </Link>
          {showSaveButton && token && !isOwner && (
            isSaved && isSavedView ? (
              <button
                onClick={handleUnsave}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800 transition-colors duration-200"
              >
                <BookMarked className="mr-2 h-4 w-4" />
                Désenregistrer
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaved}
                className={`w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isSaved
                    ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed"
                    : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                }`}
              >
                <BookMarked className={`mr-2 h-4 w-4 ${isSaved ? "fill-red-500 dark:fill-red-400" : ""}`} />
                {isSaved ? "Enregistrée" : "Enregistrer"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}