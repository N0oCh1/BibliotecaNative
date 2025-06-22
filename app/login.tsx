import { Link, useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async() => {
    try{
      const user = await signInWithEmailAndPassword(auth, email!, password!);
      if(user){
        router.replace("/");
      }
    }catch (error) {
     setError("Correo o contraseña incorrectos");
    }
  }
  const signUp = async() => {
    try{
      const user = await createUserWithEmailAndPassword(auth, email!, password!);
      if(user){
        router.replace("/");
      }
    }catch (error) {
     setError("Correo o contraseña incorrectos");
    }
  }
    
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Login Screen</Text>
      <TextInput style={style.input} placeholder="correo" value={email} onChangeText={()=>{setEmail; setError('')}} />
      <TextInput style={style.input} placeholder="contraseña" value={password} onChangeText={()=>{setPassword; setError('')}} secureTextEntry />

      <Pressable onPress={signIn} style={style.Button}>
        <Text style={{ color: "white" }}>Inicia sesión</Text>
      </Pressable>

      <Pressable onPress={signUp} style={style.Button}>
        <Text style={{ color: "white" }}>Crear cuenta</Text>
      </Pressable>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderColor:"#000000",
    borderWidth: 1,
    borderRadius:8,
    width: "80%",
  },
   Button:{
    paddingBlock:10,
    paddingInline:20,
    backgroundColor:"blue",
    borderRadius:10,
  }
})