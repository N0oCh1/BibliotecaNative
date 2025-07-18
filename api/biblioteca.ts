import { CurrentUser } from "@/utils/hooks/useAuthentication";
import type { librosBiblioteca } from "@/utils/types";
import Constants from "expo-constants";
import { subirImagen } from "./subirImagen";

const PROJECT_ID =
  Constants.expoConfig?.extra?.PROJECT_ID ||
  Constants.manifest2.extra.PROJECT_ID;

const URL_FIREBASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const addLibro = async (libro: librosBiblioteca, imagen?:string) => {
  const auth = await CurrentUser();
  const url = URL_FIREBASE + `/bibliotecas/${(await auth).localId}/libros`;
  
  try {
    const url_imagen = imagen ? imagen : await subirImagen(libro.imagen)
  const body = {
    fields: {
      titulo: { stringValue: libro.titulo },
      autor: { stringValue: libro.autor },
      categoria:{stringValue:libro.categoria},
      descripcion: { stringValue: libro.descripcion },
      formato: { stringValue: libro.formato },
      quien_agrego: { stringValue: (await auth).localId },
      imagen_url: { stringValue: url_imagen },
      fecha: { timestampValue: new Date().toISOString() },
      prestamo: {
        mapValue: {
          fields: {
            prestado: { booleanValue: false },
            puede_prestarse: { booleanValue: true },
            a_quien: { nullValue: null },
            fecha_devolucion: { nullValue: null },
          },
        },
      },
    },
  }
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.idToken}`,
      },
      body: JSON.stringify(body),
    }).then(res => res.json());
    if (response.error) {
      throw new Error(response.error.message)
    }
    return response
  }
  catch (err) {
    throw new Error(`Error al agregar libro ${err}`)
  }
};

const getBiblioteca = async (userId: string) => {
  const url = URL_FIREBASE + `/bibliotecas/${userId}/libros`;
  const auth = await CurrentUser();
  try {
    const response = await fetch(url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.idToken}`,
        },
      }
    ).then(res=>res.json()).then(data=>data.documents)
    if (response.error) {
      throw new Error(response.error.message)
    }
    return response
  }
  catch (err) {
    throw new Error("Error al obtener biblioteca")

  }
}

export { addLibro, getBiblioteca }