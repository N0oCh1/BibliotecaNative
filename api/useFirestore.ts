import { CurrentUser } from "@/utils/hooks/useAuthentication";
import Constants from "expo-constants";

const PROJECT_ID = Constants.expoConfig?.extra?.PROJECT_ID || Constants.manifest2.extra.PROJECT_ID

const setDocument = async(coleccion: string, body:any, id?:string) => {

  const token = (await CurrentUser()).idToken;
  console.log(body)
  console.log(token)
  console.log(id)
  console.log(coleccion)

  const url =`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${coleccion}${id ? `?documentId=${id}` : null}`;
  console.log("url de la peticion", url);
  try{
    const response = await fetch(url,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body)
  }).then(res=>res.json())
  console.log("respuesta", response)
  return response;
  }
  catch(err){
    console.error(err)
    return false
  }
}

export {setDocument}
