import { ObtenerLibro } from "@/api/obtenerLibros";
import type { Libro } from "@/utils/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TextInput, ActivityIndicator, Pressable, StatusBar } from "react-native";

export default function BuscarScreen() {
  const router = useRouter()
  const [data, setData] = useState<Libro[]>();
  const [busqueda, setBusqueda] = useState<string>();
  const [loadingImages, setLoadingImages] = useState<{ [id: string]: boolean }>({});

  // obtengo los libros de la api y cuando se escribe se busca
  useEffect(() => {
    async function fetchData() {
      setData(await ObtenerLibro(busqueda));
    }
    fetchData();
  }, [setData, busqueda]);

  const handleLoadStart = (id: string) => {
    setLoadingImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleLoadEnd = (id: string) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }));
  };

  const handlePress = (id:string) => {
   router.push(`/libro/${id}`);
  }

  return (
    <View style={style.container}>
      <StatusBar
      barStyle={"dark-content"}
      />
      <View>
        <TextInput style={style.busqueda} onChangeText={setBusqueda} placeholder="Buscar libro" />
      </View>
      {data &&
        <ScrollView>
          <View style={style.libroContainer}>
            {data.map((libro) => (
              <Pressable key={libro.id} style={style.libro} onPress={()=>handlePress(libro.id)}>
                <View style={{ width: 200, height: 250, justifyContent: "center", alignItems: "center" }}>
                  {loadingImages[libro.id] && (
                    <ActivityIndicator size="large" color="#000" style={{ position: "absolute", zIndex: 1 }} />
                  )}
                  <Image
                    style={{ width: 200, height: 250, objectFit: "fill" }}
                    source={{ uri: libro.imagen }}
                    onLoadStart={() => handleLoadStart(libro.id)}
                    onLoadEnd={() => handleLoadEnd(libro.id)}
                  />
                </View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{libro.titulo}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      }
    </View>
  );
}

const style = StyleSheet.create({
  container:{
    marginTop:50
  },
  libroContainer: {
    display:"flex",
    alignItems:"center",
    marginBlock:24
  },

  busqueda:{
    borderWidth:1,
    borderColor:"#000000"
  },

  libro: {
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    width:300,
    padding:12,
    borderWidth:2,
    borderColor:"#000000",
    borderRadius:16
  }
})