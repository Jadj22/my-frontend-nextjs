// inventaire.ts
export interface Inventaire {
    id_inventaire: number;
    nom: string;
    aliments?: Aliment[];
  }