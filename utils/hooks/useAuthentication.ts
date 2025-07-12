import AsyncStorage from "@react-native-async-storage/async-storage"
import type { SesionResponse } from "@/utils/types"

const CurrentUser = async() : Promise<SesionResponse> =>{
  const response = await AsyncStorage.getItem("auth")
  return response ? JSON.parse(response) : {} as SesionResponse
}
  
const setCurrentUser = async(auth:SesionResponse)=>{
  await AsyncStorage.setItem("auth", JSON.stringify(auth))
}

const removeCurrentUser = async()=>{
  await AsyncStorage.removeItem("auth")
}

export {CurrentUser, setCurrentUser, removeCurrentUser}