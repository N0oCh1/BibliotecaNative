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
export type LibroBibliotecaDetalle =  {
  prestamo: {
    mapValue: {
      fields: {
        prestado: { booleanValue: boolean },
        a_quien: { nullValue: null } | { stringValue: string },
        puede_prestarse: { booleanValue: boolean },
        fecha_devolucion: { nullValue: null } | { stringValue: string }
      }
    }
  },
  titulo: { stringValue: string },
  quien_agrego: { stringValue: string },
  descripcion: { stringValue: string },
  categoria: { stringValue: string },
  autor: { stringValue: string },
  imagen_url: { stringValue: string },
  fecha: { timestampValue: Date },
  formato: { stringValue: string }
};

export type Amigos = {
  id: string;
  nombre: string;
}

export type Prestamos = {
    name: string;
    fields: {
        titulo_libro: { stringValue: string; };
        id_usuario: { stringValue: string; };
        nombre_usuario: {stringValue:string};
        nombre_dueno: {stringValue:string};
        estado: { stringValue: string; };
        mensaje: { stringValue: string; };
        estado_devolucion: { stringValue: string; };
        id_libro: { stringValue: string; };
        ubicacion: { stringValue: string; };
        id_dueno_libro: { stringValue: string; };
        fecha_solicitud: { timestampValue: string; };
        fecha_devolucion: { timestampValue: string; };
    };
    createTime: string;
    updateTime: string;
};

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
  contrasena: string,
  pushToken: string | null
}

export type NotificationType = {
  to:string|undefined,
  title:string,
  body:string
}

export interface SesionResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string; // en segundos, como string
  localId: string;   // este es el UID
}