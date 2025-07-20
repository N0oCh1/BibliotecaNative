import React, { useCallback, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { Pressable, Text, View,StyleSheet, SafeAreaView, ScrollView, RefreshControl } from "react-native";
import { useState } from "react";
import { app } from "@/firebase";
import { removeCredencial } from "@/utils/hooks/useCredential";
import { CurrentUser, removeCurrentUser } from "@/utils/hooks/useAuthentication";
import { getDocumentCondition, getDocuments } from "@/api/useFirestore";
import type { Libro, LibroBibliotecaDetalle } from "@/utils/types";
import { obtenerUsuario } from "@/api/usuarios";
import { getBiblioteca } from "@/api/biblioteca";
import { Image } from "expo-image";

export default function HomeScreen() {
  const db = getFirestore(app)
  const [usuario, setUsuario] = useState<string>()
  const [pressed, setPressed] = useState<boolean>(false)
  const [biblioteca, setBibilioteca] = useState<LibroBibliotecaDetalle[]>()
  const [refresh, setRefresh] = useState<boolean>(false)


  const route = useRouter();
  const auth = CurrentUser();
  
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
           setUsuario(user.usuario.stringValue);
          if (isActive) {
           
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
          setBibilioteca([])
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
        backgroundColor: "#fff", // Opcional, para mejor contraste
      }}
    >
      <View style={style.barraSuperior}>
        <Text style={style.barraTexto}>
          {usuario ===undefined ? "Cargando..." : `Bienvenido, ${usuario}`}
        </Text>
        <Pressable
          style={[
            style.Button,
            { backgroundColor: pressed ? "white" : "#0056b3" }
          ]}
          onPressIn={() => setPressed(true)}
          onPressOut={() => cerrarSesion()}
        >
          <Text style={{ color: pressed ? "#0056b3" : "#ffffff", fontWeight: "bold" }}>LogOut</Text>
        </Pressable>
      </View>
      <ScrollView
        style={{ width: "100%", flex: 1, paddingTop: 8 }}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={handleRefresh} />}
      >
        <Text style={style.tituloH1}>Tu Biblioteca</Text>
        <View style={style.gridContainer}>
          {biblioteca && biblioteca.map((libro:any,index:number)=>{
            const libroId = libro.name.split("/").pop();
            return(
              <Pressable key={index} onPress={()=>handleDetails(libroId)} style={style.card}>
                <Image
                    style={style.image}
                    source={{ uri: libro.fields.imagen_url.stringValue }}
                />
                <View style={style.descripcionLibro}>
                  <Text style={style.title}>{libro.fields.titulo.stringValue}</Text>
                  <Text style={style.author}>{libro.fields.autor?.stringValue || "Sin autor"}</Text>
                </View>
              </Pressable>

            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  barraSuperior: {
    width: "100%",
    height: 56, // o 60, como prefieras
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff", // Mejor blanco para sombra visible
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: '2%',
  },
card: {
  width: '48%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  overflow: 'hidden',
  alignItems: 'center',
  padding: '3%',
  backgroundColor: '#fff',
  marginBottom: '3%',
  // Sombra sutil para iOS
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 2,
  // Sombra sutil para Android
  elevation: 2,
},
image: {
  width: '100%',
  height: 190,
  resizeMode: 'cover',
  borderRadius: 4,
},

 descripcionLibro: {
    marginTop: '5%',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  tituloH1:{
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 1,
  },
  author: {
    marginTop: 5, // Espacio entre título y autor
    fontSize: 12,
    textAlign: 'center',
    color: '#666', 
  },
  Button:{
    paddingVertical:6,
    paddingHorizontal:16,
    marginLeft:10,
    borderRadius: 4,
  },
  barraTexto:{
    color: "#0056b3",
    fontSize: 18,
    fontWeight: "bold",
  }

});
