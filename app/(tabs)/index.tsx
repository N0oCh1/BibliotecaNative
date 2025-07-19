import React, { useCallback, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { Pressable, Text, View,StyleSheet, SafeAreaView, ScrollView, RefreshControl } from "react-native";
import { useState } from "react";
import { app } from "@/firebase";
import { removeCredencial } from "@/utils/hooks/useCredential";
import { CurrentUser, removeCurrentUser } from "@/utils/hooks/useAuthentication";
import { getDocumentCondition, getDocuments } from "@/api/useFirestore";
import type { Libro } from "@/utils/types";
import { obtenerUsuario } from "@/api/usuarios";
import { getBiblioteca } from "@/api/biblioteca";
import { Image } from "expo-image";

export default function HomeScreen() {
  const db = getFirestore(app)
  const [usuario, setUsuario] = useState<string>()
  const [pressed, setPressed] = useState<boolean>(false)
  const [biblioteca, setBibilioteca] = useState<any>()
  const [refresh, setRefresh] = useState<boolean>(false)


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
  // cargar datos al focucear la pagina principal
    useFocusEffect(
    useCallback(() => {
      let isActive = true; 
      const getUsuario = async () => {
        const authData = await auth; 
        if (authData) {
          const user = await obtenerUsuario();
          console.log(user)
          if (isActive) {
            setUsuario(user.usuario.stringValue);
          }
        } else {
          console.warn("No user is currently logged in.");
        }
      };
      const obtenerBiblioteca = async() =>{
        const auth = await CurrentUser()
        try{
          setBibilioteca(await getBiblioteca(auth.localId))
        }
        catch(e){
          console.log(e)
          setBibilioteca(null)
        }
      }
      getUsuario();
      obtenerBiblioteca();
      // Cleanup para evitar fugas de memoria
      return () => {
        isActive = false;
      };
    }, []) // 🚨 IMPORTANTE: array vacío si no depende de variables del componente
  );

  const handleRefresh = async() => {

      setRefresh(true);
      const user = await auth;
      setUsuario(await getDocuments("usuarios", user.localId).then(data=>data.usuario.stringValue));
      setBibilioteca(await getBiblioteca(user.localId))
      setRefresh(false)

  }
  const handleDetails = (id:string) =>{
    route.push(`/bibliotecaLibro/${id}`);
  }

  console.log("usuarios ", usuario)
  console.log("biblioteca ", biblioteca)
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView
      style={{width:"100%", height:"100%", flex:1, marginTop:100}}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={handleRefresh} />}
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

        
        <Text>Tu Biblioteca</Text>
        {biblioteca && biblioteca.map((libro:any,index:number)=>{
          const libroId = libro.name.split("/").pop();
          return(
            <Pressable key={index} onPress={()=>handleDetails(libroId)}>
              <Image style={{width:100, height:150, objectFit:"contain"}} source={{uri:libro.fields.imagen_url.stringValue}}/>
              <Text>
                {libro.fields.titulo.stringValue}
              </Text>
            </Pressable>
          )
        })}
      
      </ScrollView>
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
