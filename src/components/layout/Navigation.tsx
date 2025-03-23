"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Book,
  Search,
  Bell,
  User,
  LogOut,
  LogIn,
  Menu,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Utensils,
  ShoppingCart,
  Package,
  ChefHat,
  UserPlus,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  onClick?: () => void;
  subItems?: { name: string; href: string }[];
}

interface NavigationProps {
  orientation: "vertical" | "horizontal";
  onToggle?: () => void;
  isOpen?: boolean;
}

export default function Navigation({ orientation, onToggle, isOpen = true }: NavigationProps) {
  const { logout, isAuthenticated, user, loadingProfile, errorProfile, login, register } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), []);
  const toggleSubMenu = useCallback((name: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);
  const toggleUserMenu = useCallback(() => setUserMenuOpen((prev) => !prev), []);
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return newTheme;
    });
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/rechercher?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  }, [searchQuery, router]);

  const handleAuthSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      router.push("/recettes");
      setShowAuthModal(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      console.error("Auth error:", err);
      setError("Erreur d'authentification. Vérifiez vos informations.");
    }
  }, [isLogin, email, password, name, login, register, router]);

  const isActive = (href: string) => pathname === href;

  const fixedNavItems = isAuthenticated
    ? [
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "Profil", href: "#", icon: User, onClick: toggleUserMenu },
      ]
    : [
        { name: "Découvrir", href: "/recettes/publiques", icon: Book },
        { name: "Connexion", href: "#", icon: LogIn, onClick: () => { setIsLogin(true); setShowAuthModal(true); } },
        { name: "S'inscrire", href: "#", icon: UserPlus, onClick: () => { setIsLogin(false); setShowAuthModal(true); } },
      ];

  const verticalNavItems = [
    {
      name: "Recettes",
      href: "/recettes",
      icon: Book,
      subItems: [
        { name: "Mes Recettes", href: "/recettes" },
        { name: "Recettes Publiques", href: "/recettes/publiques" },
        { name: "Ajouter une Recette", href: "/recettes/ajouter" },
      ],
    },
    {
      name: "Aliments",
      href: "/aliments",
      icon: Utensils,
      subItems: [
        { name: "Mes Ingrédients", href: "/aliments" },
        { name: "Ajouter un Ingrédient", href: "/aliments/ajouter" },
      ],
    },
    {
      name: "Inventaires",
      href: "/inventaires",
      icon: Package,
      subItems: [
        { name: "Mes Inventaires", href: "/inventaires" },
        { name: "Créer un Inventaire", href: "/inventaires/creer" },
      ],
    },
    {
      name: "Courses",
      href: "/courses",
      icon: ShoppingCart,
      subItems: [
        { name: "Mes Listes de Courses", href: "/courses" },
        { name: "Générer une Liste", href: "/courses/generer" },
        { name: "Créer une Liste", href: "/courses/creer" },
      ],
    },
  ];

  if (orientation === "horizontal") {
    return (
      <TooltipProvider>
        <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg z-50 flex items-center justify-between px-4 py-3 md:top-4 md:left-4 md:right-4 md:rounded-xl md:border md:border-gray-200 dark:md:border-gray-700">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none md:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={28} />
            </button>
            <Link
              href={isAuthenticated ? "/recettes" : "/"}
              className="text-xl flex items-center font-bold text-gray-800 dark:text-gray-200 transition-all duration-300 group ml-2"
              aria-label="Retour à la page d'accueil de RecetteHub"
            >
              <div className="relative mr-2 p-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-400/50 dark:group-hover:shadow-purple-400/50 transition-all duration-300">
                <ChefHat size={20} className="text-blue-600 dark:text-blue-400 group-hover:animate-pulse" />
              </div>
              <span className="relative inline-block md:inline hidden">
                <span className="relative z-10">
                  RecetteHub
                  <span className="absolute -inset-1 -z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-slow" />
                </span>
                <span className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </span>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          <div className="flex items-center space-x-3">
            {fixedNavItems.map((item) => (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <button
                    onClick={item.onClick || (() => router.push(item.href))}
                    className={`p-3 rounded-full ${
                      isActive(item.href)
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-700"
                    }`}
                    aria-label={item.name}
                  >
                    <item.icon size={24} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{item.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 bg-white dark:bg-gray-800 z-50 md:hidden p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <Link
                  href={isAuthenticated ? "/recettes" : "/"}
                  className="text-xl flex items-center font-bold text-gray-800 dark:text-gray-200 transition-all duration-300 group"
                  onClick={toggleMobileMenu}
                >
                  <div className="relative p-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-400/50 dark:group-hover:shadow-purple-400/50 transition-all duration-300">
                    <ChefHat size={20} className="text-blue-600 dark:text-blue-400 group-hover:animate-pulse" />
                  </div>
                </Link>
                <button onClick={toggleMobileMenu} className="p-2" aria-label="Fermer le menu">
                  <ChevronLeft size={28} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des recettes..."
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>
              </form>

              <ul className="space-y-3">
                {verticalNavItems.map((item) => (
                  <li key={item.name}>
                    {item.subItems ? (
                      <div>
                        <button
                          onClick={() => toggleSubMenu(item.name)}
                          className="flex items-center w-full py-3 px-4 text-gray-800 dark:text-gray-200 text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          aria-expanded={openSubMenus[item.name]}
                        >
                          <item.icon size={24} className="mr-3" />
                          {item.name}
                          <ChevronDown
                            size={20}
                            className={`ml-auto transition-transform ${openSubMenus[item.name] ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence>
                          {openSubMenus[item.name] && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="ml-8 mt-2 space-y-2 overflow-hidden"
                            >
                              {item.subItems.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    href={subItem.href}
                                    className={`block py-2 px-4 rounded-lg text-gray-600 dark:text-gray-300 text-base ${
                                      isActive(subItem.href) ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                    onClick={toggleMobileMenu}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center py-3 px-4 text-gray-800 dark:text-gray-200 text-lg font-medium rounded-lg ${
                          isActive(item.href) ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        <item.icon size={24} className="mr-3" />
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
                {fixedNavItems.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={item.onClick || (() => router.push(item.href))}
                      className="flex items-center w-full py-3 px-4 text-gray-800 dark:text-gray-200 text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      aria-label={item.name}
                    >
                      <item.icon size={24} className="mr-3" />
                      {item.name}
                    </button>
                    {item.name === "Profil" && userMenuOpen && (
                      <div ref={userMenuRef} className="ml-8 mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {loadingProfile && <p className="text-gray-500">Chargement...</p>}
                        {errorProfile && <p className="text-red-500">{errorProfile}</p>}
                        {user && !loadingProfile && !errorProfile && (
                          <>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{user.email}</p>
                            <ul className="space-y-2">
                              <li>
                                <Link
                                  href="/profil"
                                  className="flex items-center py-2 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                                  onClick={toggleMobileMenu}
                                >
                                  <User size={20} className="mr-2" />
                                  Mon Profil
                                </Link>
                              </li>
                              <li>
                                <button
                                  onClick={toggleTheme}
                                  className="flex items-center w-full py-2 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                                >
                                  {theme === "light" ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
                                  Mode {theme === "light" ? "Sombre" : "Clair"}
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => { logout(); toggleMobileMenu(); setUserMenuOpen(false); }}
                                  className="flex items-center w-full py-2 px-4 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 rounded-lg"
                                >
                                  <LogOut size={20} className="mr-2" />
                                  Déconnexion
                                </button>
                              </li>
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Modal */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAuthModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                  {isLogin ? "Connexion" : "Inscription"}
                </h3>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {!isLogin && (
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Votre nom"
                      className="w-full rounded-lg py-2 text-base"
                      required={!isLogin}
                    />
                  )}
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full rounded-lg py-2 text-base"
                    required
                  />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg py-2 text-base"
                    required
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full rounded-lg py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    {isLogin ? "Se connecter" : "S'inscrire"}
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {isLogin ? "S'inscrire" : "Se connecter"}
                  </button>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="block mt-2 text-red-500 hover:underline"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Menu for Desktop */}
        {userMenuOpen && isAuthenticated && (
          <div
            ref={userMenuRef}
            className="fixed top-16 right-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-4 border border-gray-200 dark:border-gray-700 hidden md:block"
          >
            {loadingProfile && <p className="text-gray-500">Chargement...</p>}
            {errorProfile && <p className="text-red-500">{errorProfile}</p>}
            {user && !loadingProfile && !errorProfile && (
              <>
                <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{user.email}</p>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/profil"
                      className="flex items-center py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={20} className="mr-2" />
                      Mon Profil
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center w-full py-2 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      {theme === "light" ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
                      Mode {theme === "light" ? "Sombre" : "Clair"}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="flex items-center w-full py-2 px-3 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 rounded-lg"
                    >
                      <LogOut size={20} className="mr-2" />
                      Déconnexion
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>
        )}
      </TooltipProvider>
    );
  }

  if (orientation === "vertical" && isAuthenticated) {
    return (
      <nav
        ref={navRef}
        className={`fixed top-16 bottom-4 mt-12 left-4 bg-white dark:bg-gray-800 shadow-lg z-40 hidden md:block transition-all duration-300 rounded-xl border border-gray-200 dark:border-gray-700 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {isOpen && <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Menu</h2>}
          <button
            onClick={onToggle}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            aria-label={isOpen ? "Réduire le menu" : "Ouvrir le menu"}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <ul className="space-y-2 px-2">
          {verticalNavItems.map((item) => (
            <li key={item.name}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleSubMenu(item.name)}
                    className={`flex items-center w-full px-3 py-3 rounded-lg ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    aria-expanded={openSubMenus[item.name]}
                  >
                    <item.icon className={`${isOpen ? "mr-3" : "mx-auto"}`} size={24} />
                    {isOpen && (
                      <>
                        <span className="text-base font-medium">{item.name}</span>
                        <ChevronDown
                          className={`ml-auto transition-transform ${openSubMenus[item.name] ? "rotate-180" : ""}`}
                          size={18}
                        />
                      </>
                    )}
                  </button>
                  {openSubMenus[item.name] && isOpen && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className={`block px-3 py-2 rounded-lg text-sm ${
                              isActive(subItem.href)
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-lg ${
                    isActive(item.href)
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className={`${isOpen ? "mr-3" : "mx-auto"}`} size={24} />
                  {isOpen && <span className="text-base font-medium">{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return null;
}