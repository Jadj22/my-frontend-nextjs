"use client";
import IngredientCard from "./IngredientCard";

interface Ingredient {
  id_ingredient: number;
  nom: string;
  unite?: string;
  prix_unitaire?: number | null;
}

interface IngredientListProps {
  ingredients: Ingredient[] | undefined;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: number) => void;
}

export default function IngredientList({ ingredients, onEdit, onDelete }: IngredientListProps) {
  if (!ingredients) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Chargement des ingrédients...</p>;
  }

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ingredients.map((ingredient) => (
            <IngredientCard
                key={ingredient.id_ingredient}
                ingredient={ingredient}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ))}
      </div>
  );
}