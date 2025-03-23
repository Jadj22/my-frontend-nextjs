// src/components/layout/DefaultBreadcrumb.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export default function DefaultBreadcrumb() {
  const pathname = usePathname();

  // Générer les éléments du fil d'Ariane en fonction du chemin
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathParts = pathname.split("/").filter((part) => part);
    const breadcrumbs: BreadcrumbItem[] = [{ name: "Accueil", href: "/" }];

    let currentPath = "";
    pathParts.forEach((part) => {
      currentPath += `/${part}`;
      const name = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
      breadcrumbs.push({ name, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-gray-600">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index < breadcrumbs.length - 1 ? (
              <>
                <Link
                  href={item.href}
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  {item.name}
                </Link>
                <ChevronRight className="mx-2 text-gray-400" size={16} />
              </>
            ) : (
              <span className="text-gray-800 font-medium">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}