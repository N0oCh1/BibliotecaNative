import { CurrentUser } from "@/utils/hooks/useAuthentication";
import Constants from "expo-constants";
import { FieldPath } from "firebase/firestore";
import { array } from "yup";

const PROJECT_ID =
  Constants.expoConfig?.extra?.PROJECT_ID ||
  Constants.manifest2.extra.PROJECT_ID;

const setDocument = async (coleccion: string, body: any, id?: string) => {
  const token = (await CurrentUser()).idToken;
  console.log(body);
  console.log(token);
  console.log(id);
  console.log(coleccion);

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${coleccion}${
    id ? `?documentId=${id}` : ""
  }`;
  console.log("url de la peticion", url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());
    console.log("respuesta", response);
    return response;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getDocuments = async (coleccion: string, id?: string) => {
  const token = (await CurrentUser()).idToken;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${coleccion}${
    id ? `/${id}` : ""
  }`;
  console.log("url de la peticion", url);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => data.fields);
    return response;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const getDocumentCondition = async (
  coleccion: string,
  field: string,
  value: string
) => {
  const token = (await CurrentUser()).idToken;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [
          {
            collectionId: coleccion,
          },
        ],
        where: {
          fieldFilter: {
            field: {
              fieldPath: field,
            },
            op: "EQUAL",
            value: {
              stringValue: value,
            },
          },
        },
      },
    }),
  }).then((res) => res.json());
  return response.map((item: any) => item.document);
};

const patchDocument = async (
  coleccion: string,
  documentId: string,
  newLibro: string
) => {
  const token = (await CurrentUser()).idToken;

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${coleccion}/${documentId}`;

  try {
    // Obtener el documento actual
    const doc = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());

    // Leer campos actuales
    const usuario = doc.fields.usuario;

    const biblioteca = doc.fields.biblioteca?.mapValue?.fields || {};

    // Obtener libro_id_externo si existe
    const libro_id_externo = biblioteca.libro_id_externo || {
      arrayValue: { values: [] },
    };

    // Obtener y actualizar libro_id_propio
    const libro_id_propio_actual =
      biblioteca.libro_id_propio?.arrayValue?.values?.map(
        (v: any) => v.stringValue
      ) || [];

    // Agregar sin duplicar
    const nuevoArray = [...new Set([...libro_id_propio_actual, newLibro])];

    // Reconstruir el objeto biblioteca completo
    const body = {
      fields: {
        usuario,
        biblioteca: {
          mapValue: {
            fields: {
              libro_id_externo,
              libro_id_propio: {
                arrayValue: {
                  values: nuevoArray.map((id) => ({ stringValue: id })),
                },
              },
            },
          },
        },
      },
    };

    // Enviar PATCH
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());

    if (response.error) {
      console.error(response.error);
      return false;
    }

    console.log("Libro agregado:", response);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export { setDocument, getDocuments, getDocumentCondition, patchDocument };
