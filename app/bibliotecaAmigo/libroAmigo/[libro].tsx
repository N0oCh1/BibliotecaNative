import {useEffect, useState } from "react";
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
import type { LibroBibliotecaDetalle, librosBiblioteca } from "@/utils/types";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { addLibro, getLibroAmigo } from "@/api/biblioteca";
import { FormularioPrestamo } from "@/components/FormularioPrestamo";
import Boton from "@/components/Boton";
import Alerta from "@/components/Alerta";
import SuccesModal from "@/components/SuccesModal";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from "react-native-safe-area-context";



export default function LibroAmigoScreen() {
  const router = useRouter();
  const [detalle, setDetalle] = useState<LibroBibliotecaDetalle>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const idLibro = useLocalSearchParams<{ libro: string}>().libro;
  const idAmigo = useLocalSearchParams<{ idAmigo: string }>().idAmigo;
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  
  const [alerta, setAlerta] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  const [variante, setVariante] = useState<
    "Informante" | "Exitoso" | "Advertencia"
  >("Informante");

  const [modal, setModal] = useState<boolean>(false);
  const [mensajeModal, setMensajeModal] = useState<string>("");
  const [funcion, setFuncion] = useState<() => void>();


  useLayoutEffect(() => {
    if (detalle?.titulo.stringValue) {
      navigation.setOptions({ title: detalle.titulo.stringValue });
    }
  }, [detalle]);
  useEffect(
    ()=>{
      if (!idLibro) return;
      const obtener = async () => {
        try{
          const resultado = await getLibroAmigo(idAmigo, idLibro);
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
    },[idLibro]
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
      setAlerta(true);
      setMensaje("Solo puedes agregar libros digitales a tu biblioteca");
      setVariante("Advertencia");
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
      setAlerta(true);
      setMensaje("Libro agregado a tu biblioteca");
      setVariante("Exitoso");
    } catch (error) {
      setAlerta(true);
      setMensaje("Error al agregar el libro a tu biblioteca");
      setVariante("Advertencia");
    }
  }


  return (
    
    <ScrollView >
      <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{detalle.titulo.stringValue}</Text>
      <Text style={styles.authors}>Autor(es): {detalle.autor.stringValue || "Desconocido"}</Text>
      <View style={styles.libroContainer}>
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
        ? detalle.prestamo.mapValue.fields.prestado.booleanValue === true 
          ? <Boton titulo="libro ya prestado" variante="Terciario" onPress={()=>{}}/>  
          :<Boton 
            titulo="Solicitar prestado" 
            onPress={()=>{setModalVisible(true)}} 
            variante="Cuaternario"
            icon={<FontAwesome name="send" size={24} color="white" />}
          /> 
        : <Boton 
            titulo="Agregar a tu biblioteca" 
            icon={<Ionicons name="library" size={24} color="white" />}
            onPress={()=>{
              setModal(true)
              setMensajeModal("Estas seguro que quieres agregar este libro a tu biblioteca?")
              setFuncion(()=>()=>handleAgregarBiblioteca())
            }} 
            variante="Primario"
          />
      }
      <Text style={styles.published}>
        Descripcion
      </Text>
      <Text style={styles.description}>
        {detalle.descripcion.stringValue
          ? detalle.descripcion.stringValue.replace(/<[^>]+>/g, "")
          : "Sin descripción disponible."}
      </Text>
          </View>

      <FormularioPrestamo
        detalleLibro={{
          idLibro: idLibro,
          idOwner: idAmigo,
          titulo: detalle.titulo.stringValue,
        }}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <Alerta
        variante={variante}
        visible={alerta}
        mensaje={mensaje}
        onHide={() => {
          setAlerta(false);
          router.back();
        }}
      />
      <SuccesModal
        visible={modal}
        mensaje={mensajeModal}
        rechazar={() => setModal(false)}
        aceptar={() => {
          funcion?.();
          setModal(false);
        }}
      />
          </SafeAreaView>

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding:24,
    flex: 1,
    backgroundColor: "#E8EBF7",
    alignItems: "center",
  },
  libroContainer:{
    backgroundColor:"#fff",
    alignItems:"center",
    borderRadius:8,
    padding:20
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