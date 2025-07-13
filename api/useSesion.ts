import { setCurrentUser } from "@/utils/hooks/useAuthentication";
import type { SesionResponse } from "@/utils/types";
import Constants from "expo-constants";
import type { UserCredential } from "firebase/auth";

const API_KEY = Constants.expoConfig?.extra?.API_KEY || Constants.manifest2.extra.API_KEY;

interface userProps {
  email: string,
  password: string
}


const singIn = async(email: string, password: string): Promise<SesionResponse> =>{
  try{
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,{
        method: "POST",
        body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    }).then(res=>res.json())
    setCurrentUser(response)
    console.log(response)
    return response

  }
  catch(err){
    console.error(err)
    return {}as SesionResponse  
  }
}

const singUp = async(email: string, password: string): Promise<SesionResponse> =>{
  try{
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,{
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    }).then(res=>res.json())
    console.log(response)
    setCurrentUser(response)
    return response
  }catch(err){
    console.error(err)
    return {} as SesionResponse
  }
}

export {
  singIn,
  singUp
  }

