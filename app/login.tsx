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
      console.log("Signing in with email:", email, "and password:", password);
      const user = await signInWithEmailAndPassword(auth, email!, password!);
      if(user){
        router.replace("/(tabs)");
      }
    }catch (error) {
      console.error("Error signing in:", error);
      // Aquí puedes manejar el error de manera más específica si lo deseas
      // Por ejemplo, podrías verificar el tipo de error y mostrar un mensaje diferente
     setError("Correo o contraseña incorrectos");
    }
  }
  const signUp = async() => {
    try{
      console.log("Signing in with email:", email, "and password:", password);
      const user = await createUserWithEmailAndPassword(auth, email!, password!);
      if(user){
        router.replace("/(tabs)");
      }
    }catch (error) {
      console.error("Error signing up:", error);
      // Aquí puedes manejar el error de manera más específica si lo deseas
      // Por ejemplo, podrías verificar el tipo de error y mostrar un mensaje diferente
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
      <Text style={style.titulo}>Login Screen</Text>
      <TextInput style={style.input} placeholder="correo" value={email} onChangeText={(text)=>{setEmail(text); setError('')}} />

      <TextInput style={style.input} placeholder="contraseña" value={password} onChangeText={(text)=>{setPassword(text); setError('')}} secureTextEntry />

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

//estilos
const style = StyleSheet.create({
  titulo:{
    fontSize:40,
    fontWeight:"bold",
    marginBottom: 70,
  },
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
    marginTop: 12,
  },
   Button:{
    paddingBlock:10,
    paddingInline:20,
    backgroundColor:"blue",
    borderRadius:10,
    marginTop: 12,
  }
})