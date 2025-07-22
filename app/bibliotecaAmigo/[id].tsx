import { buscarBibliotecaAmigo } from "@/api/biblioteca";
import { LibroBibliotecaDetalle } from "@/utils/types";
import { Picker } from "@react-native-picker/picker";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
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
import { Modal, TextInput, Button } from "react-native";
import { enviarSolicitud } from "@/api/prestarLibro";


export default function BibliotecaAmigoScreen() {
  const navigation = useNavigation();
  const id = useLocalSearchParams<{ id: string }>().id;
  const usuario = useLocalSearchParams<{ username: string }>().username;
  const router = useRouter();
  const [biblioteca, setBibilioteca] = useState<LibroBibliotecaDetalle[]>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState<any>(null);
  const [mensaje, setMensaje] = useState("");
  const [tiempoPrestamo, setTiempoPrestamo] = useState("");
  const [ubicacionEncuentro, setUbicacionEncuentro] = useState("");

  useFocusEffect(
    useCallback(() => {
      const obtenerBibliotecaAmigo = async () => {
        navigation.setOptions({ title: `Biblioteca de ${usuario}` });
        const bibliotecaAmigo = await buscarBibliotecaAmigo(id);
        setBibilioteca(bibliotecaAmigo);
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
  const handleDetails = (libroId: string) => {
    router.push({ pathname: `/bibliotecaAmigo/libroAmigo/${libroId}`, params: { idAmigo: id } });

  };

 
const handleSolicitarLibro = (libro: any) => {
  setLibroSeleccionado(libro);
  setModalVisible(true);
};


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
                <Pressable key={index} style={style.card} onPress={() => handleDetails(libroId)}>
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

                  <Pressable
                    style={style.solicitarButton}
                    onPress={() => handleSolicitarLibro(libro)}
                  >
                    <Text style={style.solicitarText}>Solicitar</Text>
                  </Pressable>
                </Pressable>
              );
            })}
        </View>
      </ScrollView>
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={style.modalContainer}>
    <View style={style.modalContent}>
      <Text style={style.modalTitle}>
        Solicitar: {libroSeleccionado?.fields.titulo.stringValue}
      </Text>
<View style={style.input}>

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
        style={style.input}
      />

      <TextInput
        placeholder="Mensaje opcional"
        value={mensaje}
        onChangeText={setMensaje}
        style={style.input}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        <Button
          title="Enviar"
          onPress={() => {
            console.log("Solicitud enviada:", {
              libro: libroSeleccionado,
              tiempoPrestamo,
              ubicacionEncuentro,
              mensaje,
            });
            // Aquí podrías llamar a tu API
            setModalVisible(false);
            setMensaje("");
            setTiempoPrestamo("");
            setUbicacionEncuentro("");
          }}
        />
      </View>
    </View>
  </View>
</Modal>

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

  solicitarButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  solicitarText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
},
modalContent: {
  backgroundColor: "white",
  padding: 20,
  borderRadius: 10,
  width: "80%",
},
modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},

input: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 5,
  paddingHorizontal: 10,
  marginBottom: 10,
},


});
