export type Libro = { 
  id:string;
  titulo:string;
  descripcion: string;
  autor:string;
  imagen:string;
  editorial:string;
  link:string;
  categoria:string;
}

export type librosBiblioteca = {
  titulo: string;
  autor:string;
  descripcion:string;
  formato:string;
  categoria:string;
  imagen:string | undefined;
}

export type Credenciale = { 
  usuario: string,
  contrasena: string
}

export interface SesionResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string; // en segundos, como string
  localId: string;   // este es el UID
}