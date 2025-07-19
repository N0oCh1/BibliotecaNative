import { buscarBibliotecaAmigo } from "@/api/biblioteca";
import { LibroBibliotecaDetalle } from "@/utils/types";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useCallback, useState } from "react";
import { Image } from "expo-image";
import {
  View,
  Text,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function BibliotecaAmigoScreen() {
  const navigation = useNavigation();
  const id = useLocalSearchParams<{ id: string }>().id;
  const usuario = useLocalSearchParams<{ username: string }>().username;

  const [biblioteca, setBibilioteca] = useState<LibroBibliotecaDetalle[]>();
  const [refresh, setRefresh] = useState<boolean>(false);
  
  navigation.setOptions({ title: `Biblioteca de ${usuario}` });
  useFocusEffect(
    useCallback(() => {
      const obtenerBibliotecaAmigo = async () => {
        setBibilioteca(await buscarBibliotecaAmigo(id));
      };
      obtenerBibliotecaAmigo();
    }, [id])
  );
  console.log("Biblioteca de amigo:", biblioteca);
  const handleRefresh = async () => {
    setRefresh(true);
    const updatedBiblioteca = await buscarBibliotecaAmigo(id);
    setBibilioteca(updatedBiblioteca);
    setRefresh(false);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView
        style={{ width: "100%", height: "100%", flex: 1, marginTop: 60 }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
      >
        <Text>Biblioteca</Text>
        <View style={style.gridContainer}>
          {biblioteca &&
            biblioteca.map((libro: any, index: number) => {
              const libroId = libro.name.split("/").pop();
              return (
                <Pressable key={index} style={style.card}>
                  <Image
                    style={style.image}
                    source={{ uri: libro.fields.imagen_url.stringValue }}
                  />
                  <View style={style.descripcionLibro}>
                    <Text style={style.title}>
                      {libro.fields.titulo.stringValue}
                    </Text>
                    <Text style={style.author}>
                      {libro.fields.autor?.stringValue || "Sin autor"}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: "2%",
  },
  card: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    padding: "3%",
    backgroundColor: "#fff",
    marginBottom: "3%",
  },
  image: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
    borderRadius: 4,
  },

  descripcionLibro: {
    marginTop: "5%",
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  author: {
    marginTop: 5, // Espacio entre título y autor
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
  Button: {
    paddingBlock: 10,
    paddingInline: 20,
    backgroundColor: "blue",
    borderRadius: 10,
  },
});
