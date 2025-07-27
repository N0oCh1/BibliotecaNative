import { CurrentUser } from "@/utils/hooks/useAuthentication";
import { Prestamos } from "@/utils/types";
import Constants from "expo-constants";
import { nanoid } from "nanoid/non-secure";
import { obtenerNombreUsuario, obtenerTokenDeAmigo } from "./usuarios";
import { sendNotification } from "./pushNotification";

const PROJECT_ID =
  Constants.expoConfig?.extra?.PROJECT_ID ||
  Constants.manifest2?.extra?.expoClient?.extra?.PROJECT_ID;

const URL_FIREBASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const obtenerPrestamosDelUsuario = async (
  idUsuario: string
): Promise<Prestamos[]> => {
  const auth = await CurrentUser();
  if (!auth) {
    throw new Error("Usuario no autenticado");
  }
  try {
    const url = `${URL_FIREBASE}/prestamos/${idUsuario}/prestamo`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.idToken}`,
      },
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al obtener los préstamos: ${error}`);
    }
    const data = await response.json();
    return data.documents;
  } catch (err){
    throw new Error("Error al obtener los préstamos "+err);
  }
};

const enviarSolicitud = async (
  titulo: string,
  idLibro: string,
  idOwner: string,
  datosFormulario: {
    ubicacion: string;
    tiempo: string;
    mensaje?: string;
  }
) => {
  const id_del_prestamo = nanoid(10);
  const auth = await CurrentUser();
  const pushToken = await obtenerTokenDeAmigo(idOwner)
  const nombreUsuario = await obtenerNombreUsuario()
  if (!auth) {
    throw new Error("Usuario no autenticado");
  }
  // creo todas las constantes necesarias para la solicitud
  // url para enviar la solicitud de préstamo
  const url = `${URL_FIREBASE}/prestamos/${auth.localId}/prestamo?documentId=${id_del_prestamo}`;
  // url para actualizar la biblioteca del dueño del libro con el prestamo a enviar
  const urlToUpdate = `${URL_FIREBASE}/bibliotecas/${idOwner}/libros/${idLibro}?updateMask.fieldPaths=prestamo`;
  try {

  // datos que se enviaran a prestamos
  const body = {
    fields: {
      id_dueno_libro: { stringValue: idOwner },
      id_libro: { stringValue: idLibro },
      id_usuario: { stringValue: auth.localId },
      titulo_libro:{stringValue:titulo },
      nombre_dueno: {stringValue: await obtenerNombreUsuario(idOwner)},
      nombre_usuario: {stringValue: await obtenerNombreUsuario()},
      estado: { stringValue: "pendiente" },
      ubicacion: { stringValue: datosFormulario.ubicacion },
      estado_devolucion: { stringValue: "pendiente" },
      fecha_solicitud: { timestampValue: new Date().toISOString() },
      fecha_devolucion: {
        timestampValue: new Date(
          new Date().setDate(
            new Date().getDate() + parseInt(datosFormulario.tiempo)
          )
        ).toISOString(),
      },
      mensaje: { stringValue: datosFormulario.mensaje || "no tiene mensaje" },
    },
  };
  // datos que se enviaran a la biblioteca del dueño del libro
  const bodyUpdate = {
    fields: {
      prestamo: {
        mapValue: {
          fields: {
            a_quien: { stringValue: auth.localId },
            prestado: { booleanValue: true },
            puede_prestarse: { booleanValue: true },
            prestamo: { stringValue: id_del_prestamo },
          },
        },
      },
    },
  };

    // Verificar si el usuario ya tiene un libro prestado
    const libroPrestado = await obtenerPrestamosDelUsuario(auth.localId);
    if (
      libroPrestado &&
      libroPrestado.some(
        (prestamo: any) => prestamo?.fields?.id_libro?.stringValue === idLibro
      )
    ) {
      throw new Error("Ya tienes este libro prestado");
    }
    // bloque de envio y actualizacion de la solicitud
    const prestamo_res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.idToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!prestamo_res.ok) {
      const error = await prestamo_res.text();
      throw new Error(`Error al enviar la solicitud de préstamo: ${error}`);
    }

    const update_res = await fetch(urlToUpdate, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.idToken}`,
      },
      body: JSON.stringify(bodyUpdate),
    });
    if (!update_res.ok) {
      const error = await update_res.text();
      throw new Error(`Error al actualizar la biblioteca: ${error}`);
    }
    
    await sendNotification({
      to: pushToken,
      title:`${nombreUsuario}, quiere solicitar un prestamo`,
      body: `libro a solicitar ${titulo}, por ${datosFormulario.tiempo} dias`
    })
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? "algo ocurio" + error.message
        : "Error desconocido al enviar la solicitud de préstamo"
    );
  }
};

const obtenerSolicitudes = async (): Promise<Prestamos[]> => {
  const auth = await CurrentUser();
  try {
    if (!auth) {
      throw new Error("Usuario no autenticado");
    }
    const urlIdPrestamo = `${URL_FIREBASE}/bibliotecas/${auth.localId}/libros`;
    const libros = await fetch(urlIdPrestamo, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.idToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => data.documents);

    const libroPrestado = libros ? libros.filter(
      (item: any) =>
        item.fields?.formato.stringValue === "fisico" &&
        item.fields?.prestamo.mapValue.fields.prestado.booleanValue === true
    ) : [];
    const informacionPrestamo = await Promise.all(
      libroPrestado.map(async (item: any) => {
        const prestamo = await fetch(
          `${URL_FIREBASE}/prestamos/${item?.fields?.prestamo?.mapValue?.fields?.a_quien?.stringValue}/prestamo/${item?.fields?.prestamo?.mapValue?.fields?.prestamo?.stringValue}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.idToken}`,
            },
          }
        ).then((res) => res.json());
        return prestamo || {};
      })
    );
    return informacionPrestamo || [];
  } catch (error) {
    throw new Error("Error al obtener solicitudes");
  }
};

const aceptarSolicitud = async (idAmigo: string, idPrestamo: string) => {
  const auth = await CurrentUser();
  const pushToken = await obtenerTokenDeAmigo(idAmigo)
  const nombreUsuario = await obtenerNombreUsuario()
  if (!auth) {
    throw new Error("Usuario no autenticado");
  }
  try {
    const url = `${URL_FIREBASE}/prestamos/${idAmigo}/prestamo/${idPrestamo}?updateMask.fieldPaths=estado`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.idToken}`,
      },
      body: JSON.stringify({
        fields: {
          estado: { stringValue: "aceptado" },
        },
      }),
    }).then((res) => res.json());
    if (response.error) {
      throw new Error("Error");
    }
    await sendNotification({
      to: pushToken,
      title:`${nombreUsuario}, Acepto tu solicitud`,
      body: `Ya te envio el libro mi rey 👑`
    })
  } catch (erro) {
    throw new Error("Error al aceptar solicitud");
  }
};

const rechazarSolicitud = async (idAmigo: string, idPrestamo: string, idLibro:string) => {
  const auth = await CurrentUser();
  const pushToken = await obtenerTokenDeAmigo(idAmigo)
  const nombreUsuario = await obtenerNombreUsuario()
  if (!auth) {
    throw new Error("Usuario no autenticado");
  }
  try {
    const url = `${URL_FIREBASE}/prestamos/${idAmigo}/prestamo/${idPrestamo}?updateMask.fieldPaths=estado`;
    const urlToUpdate = `${URL_FIREBASE}/bibliotecas/${auth.localId}/libros/${idLibro}?updateMask.fieldPaths=prestamo`;
    const bodyUpdate = {
    fields: {
      prestamo: {
        mapValue: {
          fields: {
            a_quien: { stringValue: idAmigo },
            prestado: { booleanValue: false },
            puede_prestarse: { booleanValue: true },
            prestamo: { stringValue: idPrestamo },
          },
        },
      },
    },
  };
  const update_res = await fetch(urlToUpdate, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.idToken}`,
      },
      body: JSON.stringify(bodyUpdate),
    });

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.idToken}`,
      },
      body: JSON.stringify({
        fields: {
          estado: { stringValue: "rechazado" },
        },
      }),
    }).then((res) => res.json());
    if (response.error) {
      throw new Error("Error");
    }
    await sendNotification({
      to: pushToken,
      title:`${nombreUsuario}, Rechazo tu solicitud`,
      body: `no`
    })
  } catch (erro) {
    throw new Error("Error al rechazar soliocitud");
  }
};

const volverASolicitar = async (idAmigo: string, idPrestamo: string, idLibro:string) => {
  const auth = await CurrentUser();
  const pushToken = await obtenerTokenDeAmigo(idAmigo)
  const nombreUsuario = await obtenerNombreUsuario()
  if (!auth) {
    throw new Error("Usuario no autenticado");
  }
  try {
    const url = `${URL_FIREBASE}/prestamos/${auth.localId}/prestamo/${idPrestamo}?updateMask.fieldPaths=estado`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.idToken}`,
      },
       body: JSON.stringify({
        fields: {
          estado: { stringValue: "pendiente" },
        },
      }),
    }).then((res) => res.json());
    if (response.error) {
      throw new Error("Error");
    }
     const urlToUpdate = `${URL_FIREBASE}/bibliotecas/${idAmigo}/libros/${idLibro}?updateMask.fieldPaths=prestamo`;
      const bodyUpdate = {
      fields: {
        prestamo: {
          mapValue: {
            fields: {
              a_quien: { stringValue: auth.localId },
              prestado: { booleanValue: true },
              puede_prestarse: { booleanValue: true },
              prestamo: { stringValue: idPrestamo },
            },
          },
        },
      },
    };
    const update_res = await fetch(urlToUpdate, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.idToken}`,
      },
      body: JSON.stringify(bodyUpdate),
    });

    await sendNotification({
      to: pushToken,
      title:`${nombreUsuario}, Volvio a solicitar el libro`,
      body: `Dale pa solo es un rato 👉👈`
    })
  } catch (erro) {
    throw new Error("Error al rechazar soliocitud");
  }
};

const devolverLibro = async (idPrestamo: string) => {
  const auth = await CurrentUser();
  try {
    if (!auth) {
      throw new Error("Usuario no autenticado");
    }
    const url = `${URL_FIREBASE}/prestamos/${auth.localId}/prestamo/${idPrestamo}`;

    const infoLibro = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.idToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        return {
          idLibro: data.fields.id_libro.stringValue,
          idDueno: data.fields.id_dueno_libro.stringValue,
          titulo: data.fields.titulo_libro.stringValue,
        };
      });

    await fetch(url, {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.idToken}`
      }
    })
    const pushToken = await obtenerTokenDeAmigo(infoLibro.idDueno)
    const nombreUsuario = await obtenerNombreUsuario()

    const urlLibro = `${URL_FIREBASE}/bibliotecas/${infoLibro.idDueno}/libros/${infoLibro.idLibro}?updateMask.fieldPaths=prestamo`;
    await fetch(urlLibro, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.idToken}`,
      },
      body: JSON.stringify({
        fields: {
          prestamo: {
            mapValue: {
              fields: {
                a_quien: { nullValue: null },
                prestado: { booleanValue: false },
                puede_prestarse: { booleanValue: true },
                prestamo: { nullValue: null },
              },
            },
          },
        },
      }),
    });
        await sendNotification({
      to: pushToken,
      title:`${nombreUsuario}, Te devolvio el libro ${infoLibro.titulo}`,
      body: `Gracias por campartirlo ahi de lo devuelvo`
    })
  } catch (error) {
    throw new Error("Error al devolver libro");
  }
};
const borrarPrestamo = async (idPrestamo: string) => {
 const auth = await CurrentUser();
  try {
    if (!auth) {
      throw new Error("Usuario no autenticado");
    }
    const url = `${URL_FIREBASE}/prestamos/${auth.localId}/prestamo/${idPrestamo}`;

    const infoLibro = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.idToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        return {
          idLibro: data.fields.id_libro.stringValue,
          idDueno: data.fields.id_dueno_libro.stringValue,
          titulo: data.fields.titulo_libro.stringValue,
        };
      });

    await fetch(url, {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.idToken}`
      }
    })

    const urlLibro = `${URL_FIREBASE}/bibliotecas/${infoLibro.idDueno}/libros/${infoLibro.idLibro}?updateMask.fieldPaths=prestamo`;
    await fetch(urlLibro, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.idToken}`,
      },
      body: JSON.stringify({
        fields: {
          prestamo: {
            mapValue: {
              fields: {
                a_quien: { nullValue: null },
                prestado: { booleanValue: false },
                puede_prestarse: { booleanValue: true },
                prestamo: { nullValue: null },
              },
            },
          },
        },
      }),
    });
  } catch (error) {
    throw new Error("Error al borrar prestamo");
  }
};


export {
  enviarSolicitud,
  obtenerPrestamosDelUsuario,
  obtenerSolicitudes,
  aceptarSolicitud,
  rechazarSolicitud,
  volverASolicitar,
  devolverLibro,
  borrarPrestamo
};
