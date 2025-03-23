"use client";
import { Utensils, Edit, Trash, Eye } from "lucide-react";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";

interface Ingredient {
    id_ingredient: number;
    nom: string;
    unite?: string;
    prix_unitaire?: number | null;
}

interface IngredientCardProps {
    ingredient: Ingredient;
    onEdit: (ingredient: Ingredient) => void;
    onDelete: (id: number) => void;
}

export default function IngredientCard({ ingredient, onEdit, onDelete }: IngredientCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold flex items-center text-gray-800 dark:text-gray-100">
                <Utensils className="mr-2 text-blue-600 dark:text-blue-400" size={18} />
                {ingredient.nom}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
                Unité: {ingredient.unite || "Non défini"}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
                Prix unitaire: {ingredient.prix_unitaire ? `${ingredient.prix_unitaire} CFA` : "Non défini"}
            </p>
            <div className="mt-3 flex gap-2">
                {/*<ButtonLink*/}
                {/*    href={`/ingredients/${ingredient.id_ingredient}`}*/}
                {/*    variant="primary"*/}
                {/*    size="sm"*/}
                {/*    aria-label={`Voir détails de ${ingredient.nom}`}*/}
                {/*>*/}
                {/*    <Eye size={16} />*/}
                {/*    Détails*/}
                {/*</ButtonLink>*/}
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(ingredient)}
                    aria-label={`Modifier ${ingredient.nom}`}
                >
                    <Edit size={16} />
                    Modifier
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(ingredient.id_ingredient)}
                    aria-label={`Supprimer ${ingredient.nom}`}
                >
                    <Trash size={16} />
                    Supprimer
                </Button>
            </div>
        </div>
    );
}