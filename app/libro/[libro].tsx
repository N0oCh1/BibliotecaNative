import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ObtenerLibroPorId } from "@/api/obtenerLibros";
import type { Libro, librosBiblioteca } from "@/utils/types";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { addLibro } from "@/api/biblioteca";


export default function DetalleLibro() {
  const { libro } = useLocalSearchParams<{ libro: string }>();
  const router = useRouter();

  const [detalle, setDetalle] = useState<Libro | null>(null);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    if (detalle?.titulo) {
      navigation.setOptions({ title: detalle.titulo });
    }
  }, [detalle]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!libro) return;

    const obtener = async () => {
      const resultado = await ObtenerLibroPorId(libro);
      setDetalle(resultado);
      setLoading(false);
    };

    obtener();
  }, [libro]);
  
  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#000" />;
  if (!detalle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del libro.</Text>
        <Button title="Volver" onPress={() => router.back()} />
      </View>
    );
  }
  
  const handleAgregar = async() =>{
    const body: librosBiblioteca = {
      titulo: detalle.titulo,
      autor: detalle.autor[0],
      descripcion: detalle.descripcion || "sin descripción",
      categoria: detalle.categoria[0],
      formato: "digital",
      imagen: detalle.imagen,
    }
    console.log("libro a agregar" , body)
    try{
      await addLibro(body, detalle.imagen)
      alert("se agrego el libro")
    }
    catch(e){
      console.log(e);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{detalle.titulo}</Text>
      <Text style={styles.authors}>Autor(es): {detalle.autor || "Desconocido"}</Text>
      <Text style={styles.published}>Editorial: {detalle.editorial || "Desconocido"}</Text>

      {detalle.imagen && (
        <Image
          source={{ uri: detalle.imagen }}
          style={styles.image}
          resizeMode="contain"
        />
        
      )}
      <Button title="agregar a biblioteca" onPress={()=>handleAgregar()}/>
      <Text style={styles.description}>
        {detalle.descripcion
          ? detalle.descripcion.replace(/<[^>]+>/g, "")
          : "Sin descripción disponible."}
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fdfdfd",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 12,
  },
  authors: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
    textAlign: "center",
  },
  published: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#eaeaea",
    borderWidth: 1,
    borderColor: "#ccc",
    // Sombra sutil para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Sombra sutil para Android
    elevation: 7,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#2c2c2c",
    textAlign: "justify",
    marginBottom: 30,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});