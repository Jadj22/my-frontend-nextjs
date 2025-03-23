"use client";
import Link from "next/link";
import { Package } from "lucide-react";

interface Inventaire {
  id_inventaire: number;
  nom: string;
  aliments?: Aliment[];
}

interface InventaireCardProps {
  inventaire: Inventaire;
}

export default function InventaireCard({ inventaire }: InventaireCardProps) {
  return (
    <div className="border rounded p-4 mb-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold flex items-center">
        <Package className="mr-2" size={18} />
        {inventaire.nom}
      </h3>
      <p className="text-gray-600">
        Aliments : {inventaire.aliments?.length || 0}
      </p>
      <Link href={`/inventaires/${inventaire.id_inventaire}`} className="text-blue-500 hover:underline mt-2 inline-block">
        Voir détails
      </Link>
    </div>
  );
}