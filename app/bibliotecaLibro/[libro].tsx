import { use, useEffect, useState } from "react";
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
import type {
  LibroBibliotecaDetalle,
} from "@/utils/types";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { getLibro, removeLibro } from "@/api/biblioteca";

import Alerta from "@/components/Alerta";
import Boton from "@/components/Boton";
import Entypo from '@expo/vector-icons/Entypo';
import SuccesModal from "@/components/SuccesModal";
import { Colors } from "react-native/Libraries/NewAppScreen";


export default function BibliotecaLibroScreen() {
  const router = useRouter();
  const { libro } = useLocalSearchParams<{ libro: string }>();
  
  const [alerta, setAlerta] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  
  const [detalle, setDetalle] = useState<LibroBibliotecaDetalle>();
  
  const [modal, setModal] = useState<boolean>(false);
  const [mensajeModal, setMensajeModal] = useState<string>("");
  const [funcion, setFuncion] = useState<() => void>();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (detalle?.titulo?.stringValue) {
      navigation.setOptions({ title: detalle.titulo.stringValue,});
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
      setAlerta(true);
      setMensaje("Libro eliminado de la biblioteca");
    } else {
      setMensaje("Error al eliminar el libro");
    }
  };
  return (
    <View  style={{position:"relative", flex:1, backgroundColor:"#E8EBF7"}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{detalle.titulo.stringValue} </Text>
        <Text style={styles.authors}>
          Autor(es): {detalle.autor.stringValue || "Desconocido"}{" "}
        </Text>
        <View style={{backgroundColor:"white", padding:20, borderRadius:8, width:"100%", alignItems:"center"}}>
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
          <Boton
          icon={<Entypo name="erase" size={24} color="#ffffffff" />}
            titulo="Borrar libro"
            variante="Terciario"
            onPress={() => {
              setModal(true);
              setMensajeModal("Estas seguro que quieres borrar el libro?");
              setFuncion(() => () => handleDeleted(libro))}}
          />
        </View>

          <Text style={styles.published}>Descripcion</Text>
          <Text style={styles.description}>
            {detalle.descripcion.stringValue
              ? detalle.descripcion.stringValue.replace(/<[^>]+>/g, "")
              : "Sin descripción disponible."}
          </Text>
        </View>
              
        <SuccesModal
          visible={modal}
          mensaje={mensajeModal}
          rechazar={() => setModal(false)}
          aceptar={() => {
            funcion?.();
            setModal(false);
          }}
        />
        <Alerta
          variante={"Exitoso"}
          mensaje={mensaje}
          visible={alerta}
          onHide={() => {
            setAlerta(false);
            router.back();
          }}
        />
      </ScrollView>
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0056b3",
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
