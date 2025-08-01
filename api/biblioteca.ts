import { CurrentUser } from "@/utils/hooks/useAuthentication";
import type { LibroBibliotecaDetalle, librosBiblioteca } from "@/utils/types";
import Constants from "expo-constants";
import { eliminarImagen, subirImagen } from "./subirImagen";
import { obtenerUsuario } from "./usuarios";

const PROJECT_ID =
  Constants.expoConfig?.extra?.PROJECT_ID ||
  Constants.manifest2?.extra?.expoClient?.extra?.PROJECT_ID;

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
      quien_agrego: { stringValue: (await obtenerUsuario().then(data=>data?.fields?.usuario?.stringValue))},
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
    });
    if (!response.ok) {
      throw new Error("hubo un problema grave")
    }
    return true
  }
  catch (err) {
    throw new Error(`Error al agregar libro ${err}`)
  }
};

const getLibro = async (libroId: string) : Promise<LibroBibliotecaDetalle> => {

  const auth = await CurrentUser();
  const url = URL_FIREBASE + `/bibliotecas/${auth.localId}/libros/${libroId}`;
  try {
    const response = await fetch(url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.idToken}`,
        },
      }
    ).then(res=>res.json()).then(data=>data.fields)
    if (response?.error) {
      throw new Error(response.error.message)
    }
    return response || {}
  }
  catch (err) {
    throw new Error("Error al obtener biblioteca " + err)

  }
}

const removeLibro = async (libroId: string, fileName:string) => {
  try {
      const auth = await CurrentUser();
      await eliminarImagen(fileName);
      const url =  URL_FIREBASE + `/bibliotecas/${auth.localId}/libros/${libroId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el libro");
      }
      return true
    } catch (error) {
      throw new Error("libro no encontrado: " + error);
    }
}


const getBiblioteca = async (userId?: string) => {
  const auth = await CurrentUser();
  const url = URL_FIREBASE + `/bibliotecas/${userId || auth.localId}/libros`;
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
    return response || []
  }
  catch (err) {
    throw new Error("Error al obtener biblioteca " + err)
  }
}

const buscarBibliotecaAmigo = async (idAmigo: string) : Promise<LibroBibliotecaDetalle[]> => {
  const auth = await CurrentUser();
  const url = URL_FIREBASE + `/bibliotecas/${idAmigo}/libros`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.idToken}`,
      },
    }).then(res => res.json()).then(data => data.documents);
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response || [];
  } catch (err) {
    throw new Error("Error al obtener biblioteca del amigo");
  }
}

const getLibroAmigo = async (idAmigo: string, libroId: string) : Promise<LibroBibliotecaDetalle> => {
  const auth = await CurrentUser();
  const url = URL_FIREBASE + `/bibliotecas/${idAmigo}/libros/${libroId}`;
  if(!auth){
    throw new Error("Usuario no autenticado")
  }
  try {
    const response = await fetch(url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.idToken}`,
        },
      }
    ).then(res=>res.json()).then(data=>data.fields)
 
    return response || {}
  }
  catch (err) {
    throw new Error("Error al obtener biblioteca " + err)

  }
}

export { addLibro, getBiblioteca, getLibro, removeLibro, buscarBibliotecaAmigo,getLibroAmigo }