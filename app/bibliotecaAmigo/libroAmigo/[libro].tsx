import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import type { LibroBibliotecaDetalle } from "@/utils/types";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { addLibro, getLibro, getLibroAmigo, removeLibro } from "@/api/biblioteca";


export default function LibroAmigoScreen() {
  const router = useRouter();
  const [detalle, setDetalle] = useState<LibroBibliotecaDetalle>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const libro = useLocalSearchParams<{ libro: string}>().libro;
  const idAmigo = useLocalSearchParams<{ idAmigo: string }>().idAmigo;
  useLayoutEffect(() => {
    if (detalle?.titulo.stringValue) {
      navigation.setOptions({ title: detalle.titulo.stringValue });
    }
  }, [detalle]);
  useEffect(
    ()=>{
      if (!libro) return;
      const obtener = async () => {
        try{
          const resultado = await getLibroAmigo(idAmigo, libro);
          setDetalle(resultado);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
        finally {
          setLoading(false);
        }
        
      };
      obtener();
    },[libro]
  )

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#000" />;
  }

  if (!detalle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del libro.</Text>
        <Button title="Volver" onPress={() => router.back()} />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{detalle.titulo.stringValue}</Text>
      <Text style={styles.authors}>Autor(es): {detalle.autor.stringValue || "Desconocido"}</Text>
      {detalle.imagen_url.stringValue && (
        <Image
          source={{ uri: detalle.imagen_url.stringValue }}
          style={styles.image}
        />
        
      )}
      {detalle.formato.stringValue && (
        <Text style={styles.published}>Formato: {detalle.formato.stringValue}</Text>
      )}
      {detalle.formato.stringValue === "fisico" 
        ? <Button title="Solicitar prestado" /> 
        : <Button title="Agregar a tu biblioteca" />
      }
      <Text style={styles.published}>
        Descripcion
      </Text>
      <Text style={styles.description}>
        {detalle.descripcion.stringValue
          ? detalle.descripcion.stringValue.replace(/<[^>]+>/g, "")
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