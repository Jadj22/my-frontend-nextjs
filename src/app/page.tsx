"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Book,
  Utensils,
  ShoppingCart,
  Package,
  ChefHat,
  ShoppingBag,
  ClipboardList,
  Warehouse,
  PlusCircle,
  HelpCircle,
  PlayCircle,
  Info,
  User,
  Star,
  Users,
  Award,
  LayoutDashboard,
} from "lucide-react";
import DefaultBreadcrumb from "@/components/layout/DefaultBreadcrumb";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useSpring, animated } from "@react-spring/web";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function HomePage() {
  const { isAuthenticated, login, register, loadingProfile } = useAuth();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    if (isAuthenticated) {
      router.push("/recettes");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
        router.push("/recettes");
      } else {
        await register(email, password, name);
        router.push("/recettes");
      }
      setShowLoginModal(false);
    } catch (err) {
      setError("Une erreur est survenue. Vérifiez vos informations ou essayez à nouveau.");
    }
  };

  const handleSectionClick = (section: string) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      router.push(`/${section.toLowerCase()}`);
    }
  };

  const sections = [
    {
      title: "Recettes",
      description: "Créez, modifiez et partagez vos recettes préférées avec facilité.",
      details: "Découvrez plus de 500 recettes partagées par la communauté ! Ajoutez la vôtre en un clic.",
      guide: [
        "Cliquez sur 'Voir recettes' pour explorer.",
        "Utilisez l'option 'Ajouter une recette' pour partager vos créations.",
        "Filtrez par ingrédient ou catégorie pour trouver l'inspiration !",
      ],
      tooltip: "Partagez vos recettes avec des amis en un clic !",
      link: "/recettes",
      icon: Book,
      secondaryIcon: ChefHat,
      color: "bg-blue-100 text-blue-600",
      stat: "500+ recettes",
    },
    {
      title: "Aliments",
      description: "Suivez vos ingrédients et gardez une trace de vos stocks.",
      details: "Gérez jusqu'à 100 ingrédients et recevez des alertes de péremption.",
      guide: [
        "Ajoutez vos ingrédients via 'Mes Ingrédients'.",
        "Définissez des dates de péremption pour des alertes automatiques.",
        "Consultez les suggestions d'utilisation basées sur vos stocks.",
      ],
      tooltip: "Recevez des suggestions de recettes basées sur vos stocks !",
      link: "/aliments",
      icon: Utensils,
      secondaryIcon: Warehouse,
      color: "bg-green-100 text-green-600",
      stat: "100+ ingrédients",
    },
    {
      title: "Courses",
      description: "Planifiez et gérez vos listes de courses en un clin d'œil.",
      details: "Générez des listes automatiques basées sur vos recettes favorites.",
      guide: [
        "Créez une liste via 'Générer une liste'.",
        "Ajoutez des items manuellement ou synchronisez avec vos recettes.",
        "Marquez les articles achetés pour une gestion facile !",
      ],
      tooltip: "Synchronisez vos listes avec votre calendrier !",
      link: "/courses",
      icon: ShoppingCart,
      secondaryIcon: ShoppingBag,
      color: "bg-purple-100 text-purple-600",
      stat: "10 listes/jour",
    },
    {
      title: "Inventaires",
      description: "Organisez vos inventaires et ajoutez des aliments rapidement.",
      details: "Suivez vos stocks en temps réel et optimisez vos achats.",
      guide: [
        "Ajoutez un inventaire avec 'Créer un inventaire'.",
        "Mettez à jour vos stocks via l'interface intuitive.",
        "Recevez des notifications quand vos stocks sont bas.",
      ],
      tooltip: "Optimisez vos achats avec des alertes de stock !",
      link: "/inventaires",
      icon: Package,
      secondaryIcon: ClipboardList,
      color: "bg-orange-100 text-orange-600",
      stat: "50+ items",
    },
  ];

  const advancedFeatures = [
    {
      title: "Tableau de bord",
      description: "Vue d'ensemble de vos recettes, aliments, courses et inventaires.",
      tooltip: "Accédez rapidement à toutes vos données depuis un seul endroit !",
      icon: LayoutDashboard,
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  const featuredItems = [
    {
      title: "Recette du jour : Poulet rôti",
      description: "Une recette simple et savoureuse à essayer ce soir !",
      link: "/recettes/poulet-roti",
      icon: ChefHat,
    },
    {
      title: "Astuce : Réduire le gâchis",
      description: "Utilisez vos restes d'ingrédients pour une soupe rapide.",
      link: "/aliments/tips",
      icon: Utensils,
    },
    {
      title: "Liste de courses hebdo",
      description: "Générée pour vous avec vos recettes préférées.",
      link: "/courses/weekly",
      icon: ShoppingBag,
    },
  ];

  const faq = [
    {
      question: "Comment commencer ?",
      answer: "Inscrivez-vous ou connectez-vous, puis explorez les sections pour configurer vos données.",
    },
    {
      question: "Où trouver mes recettes ?",
      answer: "Accédez à la section 'Recettes' et utilisez les filtres pour les retrouver facilement.",
    },
    {
      question: "Comment synchroniser mes courses ?",
      answer: "Générez une liste dans 'Courses' en sélectionnant vos recettes favorites.",
    },
  ];

  const tutorialSteps = [
    {
      title: "Étape 1 : Créez un compte",
      description: "Inscrivez-vous avec votre email pour personnaliser votre expérience.",
      icon: User,
    },
    {
      title: "Étape 2 : Ajoutez vos données",
      description: "Renseignez vos recettes, aliments et inventaires dans les sections dédiées.",
      icon: PlusCircle,
    },
    {
      title: "Étape 3 : Explorez et gérez",
      description: "Utilisez les outils pour planifier vos repas et courses efficacement.",
      icon: PlayCircle,
    },
  ];

  const testimonials = [
    {
      name: "Marie D.",
      quote: "Cette application a transformé ma façon de cuisiner ! J'adore pouvoir gérer mes recettes et mes courses en un seul endroit.",
      rating: 5,
    },
    {
      name: "Luc P.",
      quote: "Les alertes de péremption m'ont sauvé de jeter tant d'aliments. Super outil pour organiser mes inventaires !",
      rating: 4,
    },
    {
      name: "Sophie M.",
      quote: "La communauté est incroyable, j'ai découvert des recettes délicieuses grâce aux partages.",
      rating: 5,
    },
  ];

  const stats = [
    { label: "Utilisateurs", value: 1200, icon: Users },
    { label: "Recettes partagées", value: 4500, icon: Book },
    { label: "Prix gagnés", value: 3, icon: Award },
  ];

  const Number = ({ n }: { n: number }) => {
    const { number } = useSpring({
      from: { number: 0 },
      number: n,
      delay: 200,
      config: { mass: 1, tension: 20, friction: 10 },
    });
    return <animated.span>{number.to((n) => n.toFixed(0))}</animated.span>;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 min-h-screen">
      <DefaultBreadcrumb />
      <section className="mb-8 sm:mb-12 text-center relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 sm:p-8 md:p-12 text-white shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6">
            Bienvenue dans <span className="text-yellow-300">RecetteHub</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8">
            Transformez votre cuisine avec des outils puissants pour gérer vos recettes, aliments, courses et inventaires. Rejoignez une communauté passionnée !
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link
              href="#sections"
              className="inline-flex items-center px-6 sm:px-8 py-2 sm:py-3 bg-yellow-400 text-blue-900 rounded-full font-semibold hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-xl text-sm sm:text-base"
            >
              Commencer maintenant <PlusCircle className="ml-2" size={18} />
            </Link>
            <button
              onClick={() => setActiveGuide("tutorial")}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base"
            >
              <HelpCircle className="mr-2" size={16} /> Tutoriel
            </button>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {activeGuide === "tutorial" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Guide de démarrage</h2>
              <div className="space-y-4 sm:space-y-6">
                {tutorialSteps.map((step, index) => (
                  <div key={step.title} className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-700 flex items-center justify-center flex-shrink-0">
                      <step.icon className="text-blue-500 dark:text-blue-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveGuide(null)}
                className="mt-4 sm:mt-6 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 text-sm sm:text-base"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="mb-8 sm:mb-12 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 text-center">Nos chiffres clés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
            >
              <stat.icon className="text-blue-500 dark:text-blue-400 mb-2" size={28} />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                <Number n={stat.value} />+
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <TooltipProvider>
        <div id="sections" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer">
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <div
                        className={`flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full ${section.color} transition-transform group-hover:scale-110`}
                      >
                        <section.icon size={24} />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${section.color} opacity-70 hover:opacity-100 transition-opacity`}
                          >
                            <HelpCircle size={18} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 sm:w-64 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-lg">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Guide d'utilisation
                          </h4>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                            {section.guide.map((step, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-blue-500 dark:text-blue-400 mr-2">{i + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{section.title}</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                      {section.description}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic mb-3 sm:mb-4">{section.details}</p>
                    <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium mb-2 sm:mb-3">{section.stat}</div>
                    <button
                      onClick={() => handleSectionClick(section.title)}
                      className="inline-block px-4 sm:px-5 py-2 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors duration-300"
                    >
                      Voir {section.title.toLowerCase()}
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white text-xs sm:text-sm p-2 rounded-md">
                  {section.tooltip}
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </div>
      </TooltipProvider>

      <section className="mb-8 sm:mb-12 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 text-center">
          Fonctionnalités avancées
        </h2>
        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer">
                      <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <div
                          className={`flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full ${feature.color} transition-transform group-hover:scale-110`}
                        >
                          <feature.icon size={24} />
                        </div>
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h2>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                        {feature.description}
                      </p>
                      <button
                        onClick={() => handleSectionClick("recettes")}
                        className="inline-block px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-indigo-700 transition-colors duration-300"
                      >
                        Découvrir
                      </button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-white text-xs sm:text-sm p-2 rounded-md">
                    {feature.tooltip}
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </div>
        </TooltipProvider>
      </section>

      <section className="mb-8 sm:mb-12 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center justify-center">
          À la une <Info className="ml-2 text-blue-500 dark:text-blue-400" size={18} />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                href={item.link}
                className="block p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-200 dark:border-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick(item.link.split("/")[1]);
                }}
              >
                <item.icon className="text-blue-500 dark:text-blue-400 mb-2" size={22} />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-8 sm:mb-12 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 text-center">
          Ce que nos utilisateurs pensent
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-2 sm:mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="text-yellow-400" size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic mb-2 sm:mb-3">"{testimonial.quote}"</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                - {testimonial.name}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-8 sm:mb-12 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">Questions fréquentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {faq.map((item, index) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.question}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{item.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 text-center">
          Rejoignez-nous ou connectez-vous
        </h2>
        <AnimatePresence>
          {showLoginModal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md"
              >
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <ChefHat size={32} className="text-blue-600 dark:text-purple-400 mr-2 animate-pulse-slow" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isLogin ? "Connexion" : "Inscription"}
                  </h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {!isLogin && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nom
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre nom"
                        className="mt-1 sm:mt-2 w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="mt-1 sm:mt-2 w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mot de passe
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1 sm:mt-2 w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs sm:text-sm font-medium">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r justify-center from-blue-600 to-purple-600 text-white rounded-xl py-2 sm:py-3 text-sm sm:text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {isLogin ? "Se connecter" : "S'inscrire"}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {isLogin ? "Pas de compte ?" : "Déjà un compte ?"}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-1 text-blue-600 dark:text-purple-400 hover:underline font-medium"
                    >
                      {isLogin ? "S'inscrire" : "Se connecter"}
                    </button>
                  </p>
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="mt-2 text-xs sm:text-sm text-red-500 hover:underline"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {!showLoginModal && (
          <div className="text-center">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
              Pour accéder aux fonctionnalités comme les recettes ou les inventaires, veuillez vous connecter ou vous inscrire.
            </p>
            <Button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Se connecter / S'inscrire
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}