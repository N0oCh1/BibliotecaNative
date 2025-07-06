import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Credenciale } from "@/utils/types"


/**
 * ingresar credenciales del usuaio
 */ 
const setCredencial = async(credencial: Credenciale) => {
  try{
    await AsyncStorage.setItem("session", JSON.stringify(credencial))
  }
  catch(e){
    console.error(e)
  }
}
/**
 * obtener credenciales para no volver a iniciar sesion 
 */ 
const getCredencial = async (): Promise<Credenciale | null> => {
  try{
    const credencial = await AsyncStorage.getItem("session")
    return credencial ? JSON.parse(credencial) : null
  }
  catch(e){
    console.error(e)
    return null
  }
}
/**
 * remover credenciales de session cuando cierra sesion
 */
const removeCredencial = async()=>{
  try{
    await AsyncStorage.removeItem("session")
  }catch(e){
    console.error(e)
  }
}

export {setCredencial, getCredencial, removeCredencial}