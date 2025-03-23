"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Book, Utensils, ShoppingCart, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Accueil", href: "/recettes", icon: Home },
    { name: "Recettes", href: "/recettes/utilisateur", icon: Book },
    { name: "Aliments", href: "/aliments", icon: Utensils },
    { name: "Courses", href: "/courses", icon: ShoppingCart },
    { name: "Inventaires", href: "/inventaires", icon: Package },
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 fixed">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul>
        {navItems.map((item) => (
          <li key={item.name} className="mb-2">
            <Link
              href={item.href}
              className={`flex items-center p-2 rounded ${
                pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <item.icon className="mr-2" size={18} />
              {item.name}
            </Link>
          </li>
        ))}
        {user && (
          <li className="mt-4">
            <button onClick={logout} className="w-full text-left p-2 hover:bg-gray-700 rounded">
              Déconnexion
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}