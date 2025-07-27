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
import { ObtenerLibroPorId } from "@/api/obtenerLibros";
import type { Libro, librosBiblioteca } from "@/utils/types";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { addLibro, getBiblioteca } from "@/api/biblioteca";
import Alerta from "@/components/Alerta";
import { SafeAreaView } from "react-native-safe-area-context";
import Boton from "@/components/Boton";
import AntDesign from '@expo/vector-icons/AntDesign';



export default function DetalleLibro() {
  const { libro } = useLocalSearchParams<{ libro: string }>();
  const router = useRouter();

  const [alerta, setAlerta] = useState<boolean>(false);
  const [variante, setVariante] = useState<"Informante" | "Exitoso" | "Advertencia">("Informante")
  const [detalle, setDetalle] = useState<Libro | null>(null);
  const [mensaje, setMensaje] = useState<string>("")
  const [cargando, setCargando] = useState<boolean>(false);
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
      titulo: detalle.titulo ? detalle.titulo : "sin titulo",
      autor: detalle.autor ? detalle.autor[0] : "sin autor",
      descripcion: detalle.descripcion ? detalle.descripcion : "sin descripcion",
      categoria: detalle.categoria ? detalle.categoria[0] : "sin categoria",
      formato: "digital",
      imagen: detalle.imagen,
    }
    try{
      const miBiblioteca = await getBiblioteca()
      miBiblioteca.map((libro:any)=>{
        if(libro.fields.titulo.stringValue === detalle.titulo){
          throw new Error("El libro ya se encuentra en la biblioteca")
        }
      })
      await addLibro(body, detalle.imagen)
      setVariante("Exitoso")
      setMensaje("Libro agregado a la biblioteca exitosamente")
      setAlerta(true);
    }
    catch(e){
      setVariante("Informante")
      setMensaje(e instanceof Error ? e.message : "Error al agregar el libro")
      setAlerta(true);
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{position:"relative", flex:1, backgroundColor:"#fdfdfd"}}>

    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{detalle.titulo}</Text>
      <Text style={styles.authors}>Autor(es): {detalle.autor || "Desconocido"}</Text>
      <Text style={styles.published}>Editorial: {detalle.editorial || "Desconocido"}</Text>

      {detalle.imagen && (
        <Image
          source={{ uri: detalle.imagen }}
          style={styles.image}
          contentFit="contain"
        />
        
      )}
      <Boton
        titulo="Agrega a biblioteca"
        variante="Cuaternario"
        onPress={() => handleAgregar()}
        icon={<AntDesign name="plus" size={24} color="#ffff" />}
      />
      <Text style={styles.description}>
        {detalle.descripcion
          ? detalle.descripcion.replace(/<[^>]+>/g, "")
          : "Sin descripción disponible."}
      </Text>
      
      <Alerta
        variante={variante!}
        mensaje={mensaje}
        visible={alerta}
        onHide={() => {setAlerta(false)}}
      />

    </ScrollView>
  </SafeAreaView>

  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fdfdfd",
    padding:24,
    justifyContent: "center",
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