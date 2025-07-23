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
import type { LibroBibliotecaDetalle, librosBiblioteca } from "@/utils/types";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { addLibro, getLibro, getLibroAmigo, removeLibro } from "@/api/biblioteca";
import { enviarSolicitud } from "@/api/prestarLibro";
import { Picker } from "@react-native-picker/picker";
import { Modal, TextInput } from "react-native";

export default function LibroAmigoScreen() {
  const router = useRouter();
  const [detalle, setDetalle] = useState<LibroBibliotecaDetalle>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const libro = useLocalSearchParams<{ libro: string}>().libro;
  const idAmigo = useLocalSearchParams<{ idAmigo: string }>().idAmigo;
  const [modalVisible, setModalVisible] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState<any>(null);
  const [mensaje, setMensaje] = useState("");
  const [tiempoPrestamo, setTiempoPrestamo] = useState("");
  const [ubicacionEncuentro, setUbicacionEncuentro] = useState("");

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
  // agregar el libro del amigo a mi biblioteca cuando es el formato es digital
  const handleAgregarBiblioteca = async () => {
    if (detalle.formato.stringValue !== "digital") {
      alert("Solo puedes agregar libros digitales a tu biblioteca");
      return;
    }
    const body : librosBiblioteca = {
      titulo: detalle.titulo.stringValue,
      autor: detalle.autor.stringValue,
      imagen: detalle.imagen_url.stringValue,
      formato: detalle.formato.stringValue,
      descripcion: detalle.descripcion.stringValue,
      categoria: detalle.categoria.stringValue,
    }
    try{
      await addLibro(body, body.imagen);
      alert("Libro agregado a tu biblioteca");
    } catch (error) {
      alert("Error al agregar el libro a tu biblioteca");
    }
  }



     const handleEnviarSolicitud = async () => {
    if (!libroSeleccionado) return;
    try {
      const libroId = libroSeleccionado.name.split("/").pop();
      const idOwner = libroSeleccionado.fields.dueno.stringValue;

      await enviarSolicitud(libroId, idOwner, {
        ubicacion: ubicacionEncuentro,
        tiempo: tiempoPrestamo,
        mensaje,
      });

      // Limpiar y cerrar modal
      setModalVisible(false);
      setMensaje("");
      setTiempoPrestamo("");
      setUbicacionEncuentro("");
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      alert(error || "Ocurrió un error al enviar la solicitud.");
    }
  };

  const cleanCancel = async ()=>{
    setModalVisible(false);
      setMensaje("");
      setTiempoPrestamo("");
      setUbicacionEncuentro("");
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
        ? <Button title="Solicitar prestado" onPress={()=>{setModalVisible(true)}}/> 
        : <Button title="Agregar a tu biblioteca" onPress={()=>{handleAgregarBiblioteca()}}/>
      }
      <Text style={styles.published}>
        Descripcion
      </Text>
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
        Solicitar: {libroSeleccionado?.fields.titulo.stringValue}
      </Text>

      <View style={styles.solicitarButton}>
        <Picker
          selectedValue={tiempoPrestamo}
          onValueChange={(itemValue) => setTiempoPrestamo(itemValue)}
        >
          <Picker.Item label="Selecciona tiempo de préstamo" value="" />
          <Picker.Item label="3 días" value="3" />
          <Picker.Item label="7 días" value="7" />
          <Picker.Item label="14 días" value="14" />
          <Picker.Item label="30 días" value="30" />
        </Picker>
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

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button title="Cancelar" onPress={() => cleanCancel()} />
        <Button title="Enviar" onPress={handleEnviarSolicitud} />
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