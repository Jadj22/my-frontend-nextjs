/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}", // Inclut tous les fichiers dans src/
      "./app/**/*.{js,ts,jsx,tsx}", // Inclut les fichiers dans app/
      "./components/**/*.{js,ts,jsx,tsx}", // Inclut les fichiers dans components/
    ],
    theme: {
      extend: {
        transitionProperty: {
        margin: "margin",
      },
        // Personnalisation des couleurs
        colors: {
          primary: {
            DEFAULT: '#3B82F6', // Bleu utilisé pour les boutons primaires
            600: '#2563EB',
          },
          secondary: {
            DEFAULT: '#6B7280', // Gris pour les boutons secondaires
            600: '#4B5563',
          },
        },
        // Personnalisation des tailles d'écran
        screens: {
          'xs': '475px', // Ajoute un breakpoint pour les petits écrans
        },
        // Personnalisation des espacements
        spacing: {
          '128': '32rem', // Ajoute un espacement personnalisé
        },
      },
    },
    darkMode: "class", // Active le mode sombre via la classe "dark" sur <html>
    plugins: [],
  };