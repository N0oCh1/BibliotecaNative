import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useCallback, useState } from "react";
import { CurrentUser } from "@/utils/hooks/useAuthentication";
import { useFocusEffect, useRouter } from "expo-router";
import { buscarAmigo, insertarAmigo, obtenerMisAmigos } from "@/api/amigos";
import { Amigos, LibroBibliotecaDetalle, Prestamos } from "@/utils/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLibro } from "@/api/biblioteca";
import { obtenerSolicitudes } from "@/api/prestarLibro";
import calcularTiempoFaltante from "@/utils/hooks/useTiempoFaltante";
import * as Clipboard from "expo-clipboard";
import Toast from "@/components/Toast";
import Boton from "@/components/Boton";
import CartaSolicitud from "@/components/CartaSolicitud";
import Alerta from "@/components/Alerta";

export default function AmigosScreen() {
  const route = useRouter();
  const { control, handleSubmit, reset } = useForm();
  const [userId, setUserId] = useState<string>();
  const [detalleAmigos, setDetalleAmigos] = useState<Amigos[] | undefined>();
  const [solicitudesUsuario, setSolicitudesUsuario] = useState<Prestamos[]>();
  const [solicitudDetalle, setSolicitudDetalle] = useState<
    LibroBibliotecaDetalle[]
  >([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  const [toast, setToast] = useState<boolean>(false);
  const [toastMensaje, setMensajeToast] = useState<string>("");

  const [alerta, setAlerta] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  const [varianteAlerta, setVarianteAlerta]=useState<"Informante" | "Exitoso" | "Advertencia">("Informante")

  const [cargando, setCargando] = useState<boolean>(false);


  const obtenerSolicitudYLibro = async () => {
    try {
      const prestamos = await obtenerSolicitudes();
      setSolicitudesUsuario(prestamos);
      // Obtener detalles de cada libro relacionado al préstamo
      const detallesLibros = await Promise.all(
        prestamos.map(async (prestamo) => {
          return await getLibro(
            prestamo.fields?.id_libro?.stringValue
          );
        })
      );

      setSolicitudDetalle(
        detallesLibros.filter(
          (libro) => libro !== undefined
        ) as LibroBibliotecaDetalle[]
      );
    }catch(e)  {
      console.log(e)
    }
  };

  // Obtenmer id del usuario para compartir con amigos
  useFocusEffect(
    useCallback(() => {
      setSolicitudDetalle([]);
      setDetalleAmigos([]);
      setSolicitudesUsuario([]);
      const obtenerUsuario = async () => {
        const authData = await CurrentUser();
        try {
          setUserId(authData.localId);
        } catch (err) {}
      };
      const obtenerLibros = async () => {
        try {
          obtenerSolicitudYLibro();
          setDetalleAmigos(await obtenerMisAmigos());
        } catch (erro) {}
      };
      obtenerUsuario();
      obtenerLibros();
    }, [])
  );

  // Buscar amigo para agregar a amigos
  const onSubmit = async (data: any) => {
    try {
      setCargando(true);
      const amigos = await buscarAmigo(data.search);
      if (amigos && amigos.length > 0) {
        await insertarAmigo(amigos[0]);
      }
      setCargando(false);
      setMensaje("Amigo agregado");
      setVarianteAlerta("Exitoso")
      setAlerta(true);

    } catch (err: unknown) {
      setCargando(false);
      setMensaje((err as Error).message);
      setVarianteAlerta("Advertencia")
      setAlerta(true);
    }
    reset();
  };
  const obtenerAmistad = async () => {
    setSolicitudDetalle([]);
    setDetalleAmigos([]);
    setSolicitudesUsuario([]);
    setRefresh(true);
    await obtenerSolicitudYLibro();
    setRefresh(false);
    setDetalleAmigos(await obtenerMisAmigos());
    setRefresh(false);
  };

  const copiarCodigo = async (text: string | undefined) => {
    if (text) {
      setToast(true);
      await Clipboard.setStringAsync(text);
      setMensajeToast("Codigo copiado al portapapeles");
    }
  };

  const verBiblioteca = (id: string, username: string) => {
    route.push({ pathname: `/bibliotecaAmigo/${id}`, params: { username } });
  };
  return (
    <SafeAreaView
      edges={[ "bottom"]}
      style={{ flex: 1, backgroundColor: "#E8EBF7", position: "relative" }}
    >
      <View style={styles.container}>
        <View>
         
          <View style={styles.searchContainer}>
             <Boton
            titulo="Mi ID"
            variante="Secundario"
            icon={<AntDesign name="copy1" size={24} color="#0077b6" />}
            onPress={() => copiarCodigo(userId)}
          />
            <Controller
              control={control}
              name="search"
              render={({ field: { onChange, value } }) => (
                
                <TextInput
                  placeholder="ingresa el ID del amigo"
                  inputMode="search"
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                />
              )}
            />

            <Pressable onPress={handleSubmit(onSubmit)} style={styles.button}>
              {cargando ? 
                <ActivityIndicator size="small" color="#ffffff" />
                :<AntDesign name="search1" size={24} color="white" />}
            </Pressable>
          
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 2, paddingBottom: 100 ,gap:10}}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={obtenerAmistad} />
          }
        >
          <View
            style={{ padding: 10, backgroundColor: "#fff", borderRadius: 8 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                padding: 10,
                color: "#0056b3",
              }}
            >
               Amigos
            </Text>
            {detalleAmigos && detalleAmigos.length > 0 ? (
              detalleAmigos.map((amigo, index) => (
                <View
                  key={index}
                  style={{
                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {amigo.nombre}
                  </Text>

                  <Boton
                    titulo="Ver biblioteca"
                    variante="Secundario"
                    onPress={() => verBiblioteca(amigo.id, amigo.nombre)}
                  />
                </View>
              ))
            ) : (
              <Text style={{ padding: 10 }}>No tienes amigos agregados.</Text>
            )}
          </View>
          <View style={{ padding: 10, backgroundColor: "#fff", borderRadius: 8 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                padding: 10,
                color: "#0056b3",
              }}
            >
            Prestados
            </Text>
            {solicitudesUsuario && solicitudesUsuario.length > 0 ? (
              solicitudDetalle.map((libro, index) => {
                const prestamo = solicitudesUsuario[index];
                const tiempoFaltante = calcularTiempoFaltante(
                  prestamo.fields?.fecha_devolucion?.timestampValue
                );
                console.log("prestmaos = >" , prestamo)
                if (prestamo?.fields?.estado?.stringValue === "aceptado") {
                  return (
                    <CartaSolicitud
                      key={index}
                      quien={prestamo.fields.nombre_usuario.stringValue}
                      imagen={libro.imagen_url.stringValue}
                      titulo_libro={libro.titulo.stringValue}
                      ubicacion={prestamo.fields.ubicacion.stringValue}
                      mensaje={prestamo.fields.mensaje.stringValue}
                      tiempo={tiempoFaltante}
                    />
                  );
                }
                return false;
              })
            ) : (
              <Text>No hay prestamos</Text>
            )}
          </View>
        </ScrollView>
      </View>
      <Toast
        visible={toast}
        message={toastMensaje}
        onHide={() => setToast(false)}
      />
      <Alerta
        visible={alerta}
        variante={varianteAlerta}
        mensaje={mensaje}
        onHide={() => setAlerta(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  barraSuperior: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    //sombras
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
  },
  input: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    borderWidth: 2,
    borderColor: "#007bff",
    padding: 10,
  },
  button: {
    backgroundColor: "#007bff",
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  barraTexto: {
    color: "#0056b3",
    fontSize: 18,
    fontWeight: "bold",
  },
});
