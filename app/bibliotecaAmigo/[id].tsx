import { buscarBibliotecaAmigo, getLibroAmigo } from "@/api/biblioteca";
import { LibroBibliotecaDetalle, NotificationType } from "@/utils/types";

import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  RefreshControl,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";
import { eliminarAmistad } from "@/api/amigos";
import LibroPresentacion from "@/components/LibroPresentacion";
import { SafeAreaView } from "react-native-safe-area-context";
import Alerta from "@/components/Alerta";
import SuccesModal from "@/components/SuccesModal";
import Boton from "@/components/Boton";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function BibliotecaAmigoScreen() {
  const navigation = useNavigation();
  const id = useLocalSearchParams<{ id: string }>().id;
  const usuario = useLocalSearchParams<{ username: string }>().username;
  const router = useRouter();
  const [biblioteca, setBibilioteca] = useState<LibroBibliotecaDetalle[]>();
  const [refresh, setRefresh] = useState<boolean>(false);

  // estado para manejar las alertas
  const [alerta, setAlerta] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  const [variante, setVariante] = useState<
    "Informante" | "Exitoso" | "Advertencia"
  >("Informante");
  // estado para manejar el modal
  const [modal, setModal] = useState<boolean>(false);
  const [mensajeModal, setMensajeModal] = useState<string>("");
  const [funcion, setFuncion] = useState<() => void>();
  // estado para el boton cargando
  const [carga, setCargando] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setBibilioteca([]);
      const obtenerBibliotecaAmigo = async () => {
        navigation.setOptions({ title: `Biblioteca de ${usuario}` });
        const bibliotecaAmigo = await buscarBibliotecaAmigo(id);
        setBibilioteca(bibliotecaAmigo);
      };
      obtenerBibliotecaAmigo();
    }, [id])
  );

  const handleRefresh = async () => {
    try {
      setRefresh(true);
      setBibilioteca([]);
      const updatedBiblioteca = await buscarBibliotecaAmigo(id);
      setBibilioteca(updatedBiblioteca);
      setRefresh(false);
    } catch {
      setRefresh(false);
      setBibilioteca([]);
    }
  };

  const handleDetails = (libroId: string) => {
    router.push({
      pathname: `/bibliotecaAmigo/libroAmigo/${libroId}`,
      params: { idAmigo: id },
    });
  };
  const handleEliminarAmigo = async () => {
    try {
      setCargando(true);
      await eliminarAmistad(id);
      setAlerta(true);
      setVariante("Exitoso");
      setMensaje("Amigo eliminado");
      setCargando(false);
    } catch(e) {
      setAlerta(true);
      setVariante("Advertencia");
      setMensaje("Error al eliminar amigo" + e);
      setCargando(false);
    }
  };
  console.log(biblioteca);
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E8EBF7",
        position: "relative",
      }}
    >
      
      {biblioteca && biblioteca?.length > 0 ? (
        <ScrollView
          style={{ width: "100%", height: "100%" }}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
          }
        >
          <View style={style.gridContainer}>
            {biblioteca &&
              biblioteca.map((libro: any, index: number) => {
                const libroId = libro.name.split("/").pop();
                return (
                  <LibroPresentacion
                    key={index}
                    imagen={libro.fields.imagen_url?.stringValue}
                    titulo={libro.fields.titulo?.stringValue}
                    autor={libro.fields.autor?.stringValue}
                    onPress={() => handleDetails(libroId)}
                  />
                );
              })}
          </View>

        </ScrollView>
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>Tu amigo aun no tiene libros en su biblioteca</Text>
        </View>
      )}
                <Boton
        titulo="Eliminar amigo"
        variante="Terciario"
        onPress={() => {
          setMensajeModal(`Esta seguro de eliminar a ${usuario}`);
          setModal(true);
          setFuncion(() => () => handleEliminarAmigo());
        }}
        loading={carga}
        icon={<AntDesign name="deleteuser" size={24} color="white" />}
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
  );
}
const style = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: "2%",
    paddingTop: "5%"
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
