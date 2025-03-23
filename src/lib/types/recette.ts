export interface Ingredient {
    id_ingredient: number;
    nom: string;
    quantite?: number;
    unite?: string;
  }
  
  export interface Etape {
    ordre: number;
    instruction: string;
  }
  
  
  export interface Recette {
    id_recette: number;
    titre: string;
    description: string;
    publique: boolean;
    id_utilisateur: number;
    temps_preparation?: number;
    temps_cuisson?: number;
    nom_utilisateur: string; // Ajouté
    ingredients?: Ingredient[];
    etapes?: Etape[];
    createur?: string;
    date_creation?: string;
  }
  
  export interface PaginationResponse {
    recettes: Recette[];
    total: number;
    pages: number;
    current_page: number;
  }