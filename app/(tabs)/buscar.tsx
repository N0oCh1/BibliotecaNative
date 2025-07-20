import { ObtenerLibro } from "@/api/obtenerLibros";
import type { Libro } from "@/utils/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TextInput, ActivityIndicator, Pressable, StatusBar, SafeAreaView, RefreshControl } from "react-native";
import { Image } from "expo-image";

export default function BuscarScreen() {
  const router = useRouter()
  const [data, setData] = useState<Libro[]>();
  const [busqueda, setBusqueda] = useState<string>();
  const [loadingImages, setLoadingImages] = useState<{ [id: string]: boolean }>({});
  const [refresh, setRefresh] = useState<boolean>(false);

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

  const handleRefresh = async() =>{
    setRefresh(true);
    setData(await ObtenerLibro(busqueda));
    setRefresh(false)
  }
  return (
    <View style={style.container}>
      <StatusBar
      barStyle={"dark-content"}
      />
      <View style={style.busquedaContainer} >
        <TextInput style={style.busqueda} 
        onChangeText={setBusqueda} 
        placeholder="Buscar libro" />
      </View>
      {data &&
        <ScrollView
          refreshControl={<RefreshControl refreshing={refresh} onRefresh={handleRefresh} />}
        >
          <SafeAreaView style={style.libroContainer}>
            {data.map((libro) => (
              <Pressable key={libro.id} style={style.libro} onPress={() => handlePress(libro.id)}>
                <View style={{ width: "100%", height: 190, justifyContent: "center", alignItems: "center" }}>
                  {loadingImages[libro.id] && (
                    <ActivityIndicator size="large" color="#000" style={{ position: "absolute", zIndex: 1 }} />
                  )}
                  <Image
                    style={style.imagen}
                    source={{ uri: libro.imagen }}
                    onLoadStart={() => handleLoadStart(libro.id)}
                    onLoadEnd={() => handleLoadEnd(libro.id)}
                  />
                </View>
                <View style={style.descripcionLibro}>
                  <Text style={style.titulo}>{libro.titulo}</Text>
                  <Text style={style.autor}>{libro.autor || "Sin autor"}</Text>
                </View>
              </Pressable>
            ))}
          </SafeAreaView>

        </ScrollView>
      }
    </View>
  );
}

const style = StyleSheet.create({
container: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 12,
  },
  busquedaContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  busqueda: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  libroContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 50,
    
  },
  libro: {
    width: "48%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    padding: "3%",
    backgroundColor: "#fff",
    // Sombra sutil para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    // Sombra sutil para Android
    elevation: 2,
  },
  imagen: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
    borderRadius: 4,
  },
  descripcionLibro: {
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  titulo: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  autor: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
})