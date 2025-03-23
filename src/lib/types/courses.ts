export interface Course {
    id_course: number;
    nom: string;
    quantite?: number;
    achete?: boolean;
  }
  
  export interface PaginationResponse {
    courses: Course[];
    total: number;
    pages: number;
    current_page: number;
  }