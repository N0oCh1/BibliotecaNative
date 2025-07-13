import React, { useCallback } from "react";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { Pressable, Text, View,StyleSheet, SafeAreaView } from "react-native";
import { useState } from "react";
import { app } from "@/firebase";
import { removeCredencial } from "@/utils/hooks/useCredential";
import { CurrentUser, removeCurrentUser } from "@/utils/hooks/useAuthentication";
import { getDocumentCondition, getDocuments } from "@/api/useFirestore";
import type { Libro } from "@/utils/types";

export default function HomeScreen() {
  const db = getFirestore(app)
  const [usuario, setUsuario] = useState<string>()
  const [pressed, setPressed] = useState<boolean>(false)
  const [biblioteca, setBibilioteca] = useState<any>()
  const route = useRouter();
  const auth = CurrentUser();
  const guardarAlgo = async() =>{
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Alan",
        middle: "Mathison",
        last: "Turing",
        born: 1912
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  const obenerAlgo = async() =>{
    try{
      const response = await getDocs(collection(db, "users"))
      response.forEach(item=>console.log(item.id, item.data()))
    } catch(e){
      console.error(e);
    }
  }
  const cerrarSesion = async() =>{ 
    setPressed(false); 
    await removeCredencial()
    await removeCurrentUser()
    route.push("/login")
  }
  
    useFocusEffect(
    useCallback(() => {
      let isActive = true; // Para evitar setState si se desmonta rápido

      const getUsuario = async () => {
        const authData = await auth; // Solo haces el await una vez
        if (authData) {
          const user = await getDocuments("usuarios", authData.localId);
          if (isActive) {
            setUsuario(user.usuario.stringValue);
            console.log("Datos de usuario", user);
          }
        } else {
          console.warn("No user is currently logged in.");
        }
      };

      const getLibros = async () => {
        const authData = await auth;
        const libros = await getDocumentCondition("Libros", "addedBy", authData.localId);
        if (isActive) {
          setBibilioteca(libros);
          console.log("Libros en la biblioteca", libros);
        }
      };

      getUsuario();
      getLibros();

      // Cleanup para evitar fugas de memoria
      return () => {
        isActive = false;
        console.log("Pantalla perdió el foco");
      };
    }, []) // 🚨 IMPORTANTE: array vacío si no depende de variables del componente
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {usuario && 
        <Text style={{fontSize:20, fontWeight:"bold"}}>Bienvenido: {usuario}</Text>
      }
        <Pressable 
          style={[style.Button, {backgroundColor: pressed ? "white" : "blue"}]}
          onPressIn={() => setPressed(true)}
          onPressOut={() => cerrarSesion()}  
        > 
          <Text style={{color: pressed?"blue": "#ffffff"}}>LogOut</Text>
        </Pressable>

        <Pressable
          style={style.Button}
          onPress={guardarAlgo}
        >
          <Text style={{color:"white"}}>
            Prueba guardar algo
          </Text>
        </Pressable>

        <Pressable
          style={style.Button}
          onPress={obenerAlgo}
        >
          <Text style={{color:"white"}}>
            Prueba leer algo
          </Text>
        </Pressable>
      
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  Button:{
    paddingBlock:10,
    paddingInline:20,
    backgroundColor:"blue",
    borderRadius:10,
  }

});
