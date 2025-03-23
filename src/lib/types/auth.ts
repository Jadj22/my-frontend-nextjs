export interface User {
    id_utilisateur: number;
    email: string;
    nom: string;
  }
  
  export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    utilisateur: User;
  }