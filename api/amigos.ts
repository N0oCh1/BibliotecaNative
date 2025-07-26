import Constants from "expo-constants";
import { auth } from "@/firebase";
import { CurrentUser } from "@/utils/hooks/useAuthentication";
import { Amigos } from "@/utils/types";
import { sendNotification } from "./pushNotification";
import { obtenerNombreUsuario, obtenerTokenDeAmigo } from "./usuarios";

const PROJECT_ID =
  Constants.expoConfig?.extra?.PROJECT_ID ||
  Constants.manifest2?.extra?.expoClient?.extra?.PROJECT_ID;

const URL_FIREBASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const buscarAmigo = async (idAmigo: string): Promise<string[] | undefined> => {
  const auth = await CurrentUser();
  const tokenId = auth ? auth.idToken : "";
  const response = await fetch(`${URL_FIREBASE}/usuarios/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenId}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.documents;
    });
  const amigo = response
    .map((doc: any) => {
      const userID = doc.name.split("/").pop();
      if (userID === idAmigo) {
        return userID;
      }
    })
    .filter((item: any) => item !== undefined);

  if (amigo.length > 0) {
    return amigo;
  } else {
    throw new Error("Amigo no encontrado");
  }
};


const insertarAmigo = async (idAmigo: string|undefined) => {
  const auth = await CurrentUser();
  const pushToken = await obtenerTokenDeAmigo(idAmigo)
  const nombreUsuario = await obtenerNombreUsuario()
  const tokenId = auth ? auth.idToken : "";
  if (!idAmigo) {
    throw new Error("El ID del amigo no puede ser vacío");
  }
    // Evitar que el usuario se agregue a sí mismo
  if (idAmigo === auth.localId) {
    throw new Error("No puedes agregarte a ti mismo como amigo");
  }
  try {
    // Obtener mis amigos actuales
    const misAmigosData = await fetch(`${URL_FIREBASE}/usuarios/${auth.localId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenId}`,
      },
    }).then((res) => res.json());

    let misAmigos: { stringValue: string }[] = [];
    if (
      misAmigosData.fields &&
      misAmigosData.fields.amigos &&
      misAmigosData.fields.amigos.arrayValue &&
      misAmigosData.fields.amigos.arrayValue.values
    ) {
      misAmigos = misAmigosData.fields.amigos.arrayValue.values.map((item: any) => ({ stringValue: item.stringValue }));
    }

    // Evitar duplicados
    if (!misAmigos.some((amigo) => amigo.stringValue === idAmigo)) {
      misAmigos.push({ stringValue: idAmigo });
    }
    else{
      throw new Error("Ya eres amigo de este usuario");
    }

    // Obtener amigos del otro usuario
    const amigosData = await fetch(`${URL_FIREBASE}/usuarios/${idAmigo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenId}`,
      },
    }).then((res) => res.json());

    let amigos: { stringValue: string }[] = [];
    if (
      amigosData.fields &&
      amigosData.fields.amigos &&
      amigosData.fields.amigos.arrayValue &&
      amigosData.fields.amigos.arrayValue.values
    ) {
      amigos = amigosData.fields.amigos.arrayValue.values.map((item: any) => ({ stringValue: item.stringValue }));
    }

    // Evitar duplicados
    if (!amigos.some((amigo) => amigo.stringValue === auth.localId)) {
      amigos.push({ stringValue: auth.localId });
    }

    // Actualizar mi lista de amigos
    await fetch(
      `${URL_FIREBASE}/usuarios/${auth.localId}?updateMask.fieldPaths=amigos`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify({
          fields: {
            amigos: {
              arrayValue: {
                values: misAmigos,
              },
            },
          },
        }),
      }
    );

    // Actualizar la lista de amigos del otro usuario
    await fetch(
      `${URL_FIREBASE}/usuarios/${idAmigo}?updateMask.fieldPaths=amigos`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify({
          fields: {
            amigos: {
              arrayValue: {
                values: amigos,
              },
            },
          },
        }),
      }
    );
    await sendNotification({
      to: pushToken,
      title: `${nombreUsuario} te ha agregado como amigo`,
      body: `Ahora eres pana de "${nombreUsuario}" 🎊`
    })
  } catch (err) {
    throw new Error(`Error al insertar amigo: ${err}`);
  }
};

const obtenerMisAmigos = async (): Promise<Amigos[]> => {
  const auth = await CurrentUser();
  const tokenId = auth.idToken;
  try{
    const misAmigos = await fetch(`${URL_FIREBASE}/usuarios/${auth.localId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokenId}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data?.fields?.amigos?.arrayValue?.values?.map((item: any) => item.stringValue) || [];
    });

    const amigosDetails = await Promise.all(
      misAmigos.map(async (idAmigo:string) => {
        const details = await fetch(`${URL_FIREBASE}/usuarios/${idAmigo}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenId}`,
          },
        }).then((res) => res.json()).then((data)=>data?.fields?.usuario?.stringValue);
        
        return { id: idAmigo, nombre: details };
      })
    );
    return amigosDetails || [];
  }
  catch(err){
    throw new Error(`Error al obtener mis amigos: ${err}`);
  }
}
const eliminarAmistad = async(idAmigo:string) =>{
  const auth = await CurrentUser();
  const pushToken = await obtenerTokenDeAmigo(idAmigo)
  const nombreUsuario = await obtenerNombreUsuario()
  const tokenId = auth ? auth.idToken : "";
  if (!idAmigo) {
    throw new Error("El ID del amigo no puede ser vacío");
  }
    // Evitar que el usuario se agregue a sí mismo
  if (idAmigo === auth.localId) {
    throw new Error("No puedes agregarte a ti mismo como amigo");
  }
  try {
    // Obtener mis amigos actuales
    const misAmigosData = await fetch(`${URL_FIREBASE}/usuarios/${auth.localId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenId}`,
      },
    }).then((res) => res.json()).then(data=>data.fields.amigos.arrayValue.values);
    
   
    const misnuevosAmigosData = misAmigosData.filter((item:any)=>item.stringValue !== idAmigo)
 

    // Obtener amigos del otro usuario
    const amigosData = await fetch(`${URL_FIREBASE}/usuarios/${idAmigo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenId}`,
      },
    }).then((res) => res.json()).then(data=>data.fields.amigos.arrayValue.values);;

    const nuevosAmigosData = amigosData.filter((item:any)=>item.stringValue !== auth.localId)
    
    // Actualizar mi lista de amigos
    await fetch(
      `${URL_FIREBASE}/usuarios/${auth.localId}?updateMask.fieldPaths=amigos`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify({
          fields: {
            amigos: {
              arrayValue: {
                values: misnuevosAmigosData,
              },
            },
          },
        }),
      }
    );

    // Actualizar la lista de amigos del otro usuario
    await fetch(
      `${URL_FIREBASE}/usuarios/${idAmigo}?updateMask.fieldPaths=amigos`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenId}`,
        },
        body: JSON.stringify({
          fields: {
            amigos: {
              arrayValue: {
                values: nuevosAmigosData,
              },
            },
          },
        }),
      }
    );
    
    await sendNotification({
      to: pushToken,
      title: `Ya no eres amigo de ${nombreUsuario}`,
      body: "Tu sabes lo que hiciste 🖕"
    })
  } catch (err) {
    throw new Error(`Error al insertar amigo: ${err}`);
  }
}

export { buscarAmigo, insertarAmigo, obtenerMisAmigos, eliminarAmistad };
