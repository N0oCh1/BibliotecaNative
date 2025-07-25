import { CurrentUser } from "@/utils/hooks/useAuthentication";
import { getCredencial } from "@/utils/hooks/useCredential";
import Constants from "expo-constants";

const PROJECT_ID =
  Constants.expoConfig?.extra?.PROJECT_ID ||
  Constants.manifest2?.extra?.expoClient?.extra?.PROJECT_ID;
const URL_FIREBASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const agregarUsuario = async (usuario:string)=>{
  const auth = await CurrentUser()
  const credential = await getCredencial()
  const url = URL_FIREBASE+`/usuarios?documentId=${auth.localId}`
  const body = {
      fields:{
        usuario:{stringValue:usuario},
        amigos:{arrayValue:{values:[]}},
        pushToken:{stringValue:credential?.pushToken || ""}}
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
      return true
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
    return response || {}
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
    if(!response.ok){
      throw new Error("Error al agregar amigo")
    }
    return true
  }
  catch(err){
    throw new Error("Error al agregar amigo")
  }
}
const obtenerNombreUsuario = async(idAmigo?:string) => {
  const auth = await CurrentUser()
  const url = URL_FIREBASE + `/usuarios/${idAmigo || auth.localId}`
  try{
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.idToken}`
      }
    }).then(res=>res.json()).then(data=>data?.fields?.usuario?.stringValue)
    if(response.error){
      console.error(response.error.message)
      throw new Error(response.error.message)
    }
    return response || {}
  }
    catch(err){
      throw new Error("Error al obtener usuario")
    }
}

const obtenerTokenDeAmigo = async(idAmigo?:string) => {
  const auth = await CurrentUser()
  const url = URL_FIREBASE + `/usuarios/${idAmigo || auth.localId}`
  try{
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.idToken}`
      }
    }).then(res=>res.json()).then(data=>data.fields.pushToken.stringValue)
    if(response.error){
      console.error(response.error.message)
      throw new Error(response.error.message)
    }
    return response || ""
  }
    catch(err){
      throw new Error("Error al obtener usuario")
    }
}

export {
  agregarUsuario,
  agregarAmigo,
  obtenerUsuario,
  obtenerNombreUsuario,
  obtenerTokenDeAmigo
}
