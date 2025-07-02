export type Libro = { 
  id:string;
  titulo:string;
  descripcion: string;
  autor:string[];
  imagen:string;
  editorial:string;
  link:string;
}

export type Credenciale = { 
  usuario: string,
  contrasena: string
}