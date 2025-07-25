import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ObtenerLibroPorId } from "@/api/obtenerLibros";
import type {
  Libro,
  LibroBibliotecaDetalle,
  librosBiblioteca,
} from "@/utils/types";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { addLibro, getLibro, removeLibro } from "@/api/biblioteca";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Modal, TextInput } from "react-native";
import { Amigos } from "@/utils/types";
import { obtenerMisAmigos } from "@/api/amigos";

export default function BibliotecaLibroScreen() {
  const [seleccionada, setSeleccionada] = useState("");
  const { libro } = useLocalSearchParams<{ libro: string }>();
  const router = useRouter();
  console.log("libro", libro);
  const [detalle, setDetalle] = useState<LibroBibliotecaDetalle>();
  const [mensaje, setMensaje] = useState("");
  const [tiempoPrestamo, setTiempoPrestamo] = useState("");
  const [ubicacionEncuentro, setUbicacionEncuentro] = useState("");

  const [detalleAmigos, setDetalleAmigos] = useState<Amigos[] | undefined>();

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    if (detalle?.titulo.stringValue) {
      navigation.setOptions({ title: detalle.titulo.stringValue });
    }
  }, [detalle]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!libro) return;

    const obtener = async () => {
      const resultado = await getLibro(libro);
      setDetalle(resultado);
      setLoading(false);
    };

    obtener();
  }, [libro]);

  useEffect(() => {
    const cargarAmigos = async () => {
      try {
        const amigos = await obtenerMisAmigos();
        console.log("Amigos obtenidos:", amigos); // 👈 debug
        setDetalleAmigos(amigos);
      } catch (error) {
        console.error("Error al obtener amigos:", error);
        setDetalleAmigos([]);
      }
    };

    cargarAmigos();
  }, []);

  if (loading)
    return (
      <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#000" />
    );
  if (!detalle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No se pudo cargar la información del libro.
        </Text>
        <Button title="Volver" onPress={() => router.back()} />
      </View>
    );
  }
  const handleDeleted = async (libro: string) => {
    const nombreArchivo = detalle.imagen_url.stringValue.split("/").pop() || "";
    const nombreImagen = nombreArchivo.split("?")[0]; // Extraer el nombre del archivo sin parámetros de consulta
    const result = await removeLibro(libro, nombreImagen);
    if (result) {
      alert("Libro eliminado de la biblioteca");
      router.back();
    } else {
      alert("Error al eliminar el libro");
    }
  };

  const handleCompartir = async () => {};
  // const handleAgregar = async() =>{
  //   const body: librosBiblioteca = {
  //     titulo: detalle.titulo,
  //     autor: detalle.autor[0],
  //     descripcion: detalle.descripcion || "sin descripción",
  //     categoria: detalle.categoria[0],
  //     formato: "digital",
  //     imagen: detalle.imagen,
  //   }
  //   console.log("libro a agregar" , body)
  //   try{
  //     await addLibro(body, detalle.imagen)
  //     alert("se agrego el libro")
  //   }
  //   catch(e){
  //     console.log(e);
  //   }
  // }

  const cleanCancel = async () => {
    setModalVisible(false);
    setMensaje("");
    setTiempoPrestamo("");
    setUbicacionEncuentro("");
    setSeleccionada(""); 
  };

  console.log("detalle", detalle);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{detalle.titulo.stringValue} </Text>

      <Text style={styles.authors}>
        Autor(es): {detalle.autor.stringValue || "Desconocido"}{" "}
      </Text>

      {detalle.imagen_url.stringValue && (
        <Image
          source={{ uri: detalle.imagen_url.stringValue }}
          style={styles.image}
        />
      )}
      {detalle.formato.stringValue && (
        <Text style={styles.published}>
          Formato: {detalle.formato.stringValue}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          gap: 7,
          alignItems: "center",
          margin: 10,
        }}
      >
        <Button
          title="Borrar de la biblioteca"
          onPress={() => handleDeleted(libro)}
        />
        <AntDesign
          name="sharealt"
          size={24}
          color="grey"
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </View>

      <Text style={styles.published}>Descripcion</Text>
      <Text style={styles.description}>
        {detalle.descripcion.stringValue
          ? detalle.descripcion.stringValue.replace(/<[^>]+>/g, "")
          : "Sin descripción disponible."}
      </Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Prestar: {detalle.titulo.stringValue}
            </Text>

            {detalleAmigos && detalleAmigos.length > 0 ? (
              detalleAmigos.map((amigo, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                  onPress={() =>
                    setSeleccionada(
                      seleccionada === amigo.nombre ? "" : amigo.nombre
                    )
                  }
                >
                  <AntDesign
                    name={
                      seleccionada === amigo.nombre
                        ? "checksquare"
                        : "checksquareo"
                    }
                    size={24}
                    color={seleccionada === amigo.nombre ? "#007AFF" : "#ccc"}
                  />
                  <Text style={{ marginLeft: 10 }}>{amigo.nombre}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ padding: 10 }}>No tienes amigos agregados.</Text>
            )}

            <View style={styles.solicitarButton}>
              
            </View>

            <TextInput
              placeholder="Ubicación de encuentro"
              value={ubicacionEncuentro}
              onChangeText={setUbicacionEncuentro}
              style={styles.solicitarText}
            />

            <TextInput
              placeholder="Mensaje opcional"
              value={mensaje}
              onChangeText={setMensaje}
              style={styles.solicitarText}
            />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Button title="Cancelar" onPress={() => cleanCancel()} />
              <Button title="Enviar" />
            </View>
          </View>
        </View>
      </Modal>
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

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // fondo semitransparente
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  solicitarButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    overflow: "hidden",
  },
  solicitarText: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
