import { CurrentUser } from "@/utils/hooks/useAuthentication";
import Constants from "expo-constants";

const PROJECT_ID =
  Constants.expoConfig?.extra?.PROJECT_ID ||
  Constants.manifest2.extra.PROJECT_ID;
const URL_FIREBASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const agregarUsuario = async (usuario:string)=>{
  const auth = await CurrentUser()
  const url = URL_FIREBASE+`/usuarios?documentId=${auth.localId}`
  const body = {
      fields:{
        usuario:{stringValue:usuario},
        amigos:{arrayValue:{values:[]}}
      }
    }
    try{
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.idToken}`,
        },
        body: JSON.stringify(body),
      }).then(res=>res.json())
      if(response.error){
        throw new Error(response.error.message)
      }
      return response
    }
    catch(err){
      throw new Error(`Error al agregar usuario ${err}`)
    }
  }

const obtenerUsuario = async()=>{
  const auth = await CurrentUser()
  const url = URL_FIREBASE + `/usuarios/${auth.localId}`
  try{
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.idToken}`
      }
    }).then(res=>res.json())
    if(response.error){
      throw new Error(response.error.message)
    }
    return response
  }
    catch(err){
      throw new Error("Error al obtener usuario")
    }
  }


const agregarAmigo = async (idAmigo:string)=>{
  const auth = await CurrentUser()
  const url = URL_FIREBASE+ `/usuarios/${auth.localId}?updateMask.fieldPaths=amigos`
  try{
    const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "Aplication/json",
      "Authorization": `Bearer ${(await auth).idToken}`,
    },
    body: JSON.stringify({
      fields:{
        amigos:{
          arrayValue:{
            values:[{
              stringValue:idAmigo
            }]
          }
        }
      }
    })
    })
    .then(res=>res.json())
    if(response.error){
      throw new Error(response.error.message)
    }
    return response
  }
  catch(err){
    throw new Error("Error al agregar amigo")
  }
}

export {
  agregarUsuario,
  agregarAmigo,
  obtenerUsuario
}
