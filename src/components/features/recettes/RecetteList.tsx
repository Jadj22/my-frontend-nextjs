import RecetteCard from "@/components/features/recettes/RecetteCard";

interface Recette {
  id_recette: number;
  titre: string;
  description: string;
  publique: boolean;
  id_utilisateur: number;
  imageUrl?: string;
  date_creation?: string;
  createur?: string;
}

interface RecetteListProps {
  recettes: Recette[];
  showSaveButton?: boolean;
  onDetailClick?: () => boolean; // Ajout de la prop
}

export default function RecetteList({ recettes, showSaveButton = true, onDetailClick }: RecetteListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recettes.map((recette) => (
        <RecetteCard
          key={recette.id_recette}
          recette={recette}
          showSaveButton={showSaveButton}
          onDetailClick={onDetailClick}
        />
      ))}
    </div>
  );
}