"use client";
import InventaireCard from "./InventaireCard";

interface InventaireListProps {
  inventaires: Inventaire[];
}

export default function InventaireList({ inventaires }: InventaireListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {inventaires.map((inventaire) => (
        <InventaireCard key={inventaire.id_inventaire} inventaire={inventaire} />
      ))}
    </div>
  );
}