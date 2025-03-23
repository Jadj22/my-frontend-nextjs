"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Home, Book, Utensils, ShoppingCart, Package, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Accueil", href: "/recettes", icon: Home },
    { name: "Recettes", href: "/recettes/utilisateur", icon: Book },
    { name: "Aliments", href: "/aliments", icon: Utensils },
    { name: "Courses", href: "/courses", icon: ShoppingCart },
    { name: "Inventaires", href: "/inventaires", icon: Package },
  ];

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">Gestion de Recettes</div>
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center hover:text-blue-200">
                <item.icon className="mr-1" size={18} />
                {item.name}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <button onClick={logout} className="flex items-center hover:text-blue-200">
                <LogOut className="mr-1" size={18} /> Déconnexion
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}