import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ObtenerLibroPorId } from "@/api/obtenerLibros";
import type { Libro } from "@/utils/types";

export default function DetalleLibro() {
  const { libro } = useLocalSearchParams<{ libro: string }>();
  const router = useRouter();

  const [detalle, setDetalle] = useState<Libro | null>(null);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{detalle.titulo}</Text>
      <Text style={styles.authors}>Autor(es): {detalle.autor?.join(", ") || "Desconocido"}</Text>
      <Text style={styles.published}>Editorial: {detalle.editorial || "Desconocido"}</Text>

      {detalle.imagen && (
        <Image
          source={{ uri: detalle.imagen }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <Text style={styles.description}>
        {detalle.descripcion
          ? detalle.descripcion.replace(/<[^>]+>/g, "")
          : "Sin descripción disponible."}
      </Text>

      <Button title="Volver a la búsqueda" onPress={() => router.back()} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  authors: { fontSize: 16, marginBottom: 4 },
  published: { fontSize: 14, color: "#555", marginBottom: 10 },
  image: { width: "100%", height: 300, marginVertical: 20 },
  description: { fontSize: 16, lineHeight: 22, marginBottom: 20 },
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

