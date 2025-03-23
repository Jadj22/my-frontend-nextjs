"use client";
import { useState } from "react";
import { useForm } from "@/hooks/useForm";
import { useAuth } from "@/context/AuthContext";
import { UserPlus, Mail, Lock } from "lucide-react";
import { validateEmail, validatePassword } from "@/lib/utils/validation";

export default function InscriptionPage() {
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    email: { value: "" },
    password: { value: "" },
    nom: { value: "" },
  };

  const { values, errors, handleChange, validate } = useForm(initialValues);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rules = {
      email: (value: string) => (validateEmail(value) ? null : "Email invalide"),
      password: (value: string) => (validatePassword(value) ? null : "Mot de passe trop court (min 8 caractères)"),
      nom: (value: string) => (!value ? "Nom requis" : null),
    };
    if (validate(rules)) {
      try {
        await register(values.email.value as string, values.password.value as string, values.nom.value as string);
      } catch { // Supprimé err inutilisé
        setError("Échec de l'inscription. Cet email est peut-être déjà utilisé.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Nom</label>
          <div className="flex items-center border rounded">
            <UserPlus className="m-2" size={18} />
            <input
              type="text"
              value={values.nom.value as string}
              onChange={(e) => handleChange("nom", e.target.value)}
              className="w-full p-2 outline-none"
              placeholder="Entrez votre nom"
            />
          </div>
          {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <div className="flex items-center border rounded">
            <Mail className="m-2" size={18} />
            <input
              type="email"
              value={values.email.value as string}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full p-2 outline-none"
              placeholder="Entrez votre email"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Mot de passe</label>
          <div className="flex items-center border rounded">
            <Lock className="m-2" size={18} />
            <input
              type="password"
              value={values.password.value as string}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full p-2 outline-none"
              placeholder="Entrez votre mot de passe"
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          S'inscrire
        </button>
      </form>
      <p className="mt-4 text-center">
        Deja un compte ? <a href="/auth/connexion" className="text-blue-500 hover:underline">Connectez-vous</a>
      </p>
    </div>
  );
}