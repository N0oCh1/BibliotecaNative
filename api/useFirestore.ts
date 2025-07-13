import { CurrentUser } from "@/utils/hooks/useAuthentication";
import Constants from "expo-constants";

const PROJECT_ID = Constants.expoConfig?.extra?.PROJECT_ID || Constants.manifest2.extra.PROJECT_ID

const setDocument = async(coleccion: string, body:any, id?:string) => {

  const token = (await CurrentUser()).idToken;
  console.log(body)
  console.log(token)
  console.log(id)
  console.log(coleccion)

  const url =`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${coleccion}${id ? `?documentId=${id}` : ""}`;
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

const getDocuments = async(coleccion: string, id?:string) => {
  const token = (await CurrentUser()).idToken;
  const url =`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${coleccion}${id ? `/${id}` : ":listCollectionsIds"}`;
  console.log("url de la peticion", url);
  try{
    const response = await fetch(url,{
        method: "GET",
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
          }
        }
      ).then(res=>res.json()).then(data=>data.fields)
    return response;
  }
  catch(err){
    console.error(err)
    return false
  }
}
const getDocumentCondition = async(coleccion:string, field:string, value:string) =>{
  const token = (await CurrentUser()).idToken;
  const url =`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
  const response = await fetch(url,{
    method: "POST",
    headers:{
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`},
    body: JSON.stringify({
      structuredQuery: {
        from: [
          {
            collectionId: coleccion
          }
        ],
        where: {
          fieldFilter: {
            field: {
              fieldPath: field
            },
            op: "EQUAL",
            value: {
              stringValue: value
            }
          }
        }
      }
    }),
  }).then(res=>res.json())
  return response.map((item:any)=>item.document)
}

  

export {setDocument, getDocuments, getDocumentCondition}
