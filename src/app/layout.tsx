import "@/styles/globals.css"; // Correct path to src/styles/globals.css
import ClientLayout from "@/components/layout/ClientLayout";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Gestion de Recettes",
  description: "Une application pour gérer vos recettes, aliments, courses et inventaires.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Ensure viewport meta tag for responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Main content wrapper */}
        <div className="flex flex-1 flex-col ">
          {/* ClientLayout with children */}
          <ClientLayout>{children}</ClientLayout>
        </div>
        {/* Toaster with responsive positioning */}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "text-sm md:text-base",
            style: {
              margin: "8px",
              padding: "12px 16px",
              maxWidth: "90vw", // Prevents overflow on small screens
              width: "auto",
              borderRadius: "8px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}