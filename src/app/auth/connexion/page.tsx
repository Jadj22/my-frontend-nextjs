"use client";
import { useState } from "react";
import { useForm } from "@/hooks/useForm";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail } from "lucide-react";
import { validateEmail, validatePassword } from "@/lib/utils/validation";

export default function ConnexionPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    email: { value: "" },
    password: { value: "" },
  };

  const { values, errors, handleChange, validate } = useForm(initialValues);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rules = {
      email: (value: string) => (validateEmail(value) ? null : "Email invalide"),
      password: (value: string) => (validatePassword(value) ? null : "Mot de passe trop court (min 8 caractères)"),
    };
    if (validate(rules)) {
      try {
        await login(values.email.value as string, values.password.value as string);
      } catch (err) {
        setError("Échec de la connexion. Vérifiez vos identifiants.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Se connecter
        </button>
      </form>
      <p className="mt-4 text-center">
        Pas de compte ? <a href="/auth/inscription" className="text-blue-500 hover:underline">Inscrivez-vous</a>
      </p>
    </div>
  );
}