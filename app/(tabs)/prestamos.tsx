import { getLibroAmigo } from "@/api/biblioteca";
import {
  aceptarSolicitud,
  borrarPrestamo,
  devolverLibro,
  obtenerPrestamosDelUsuario,
  obtenerSolicitudes,
  rechazarSolicitud,
  volverASolicitar,
} from "@/api/prestarLibro";
import { obtenerUsuario } from "@/api/usuarios";
import Boton from "@/components/Boton";
import CartaSolicitud from "@/components/CartaSolicitud";
import { CurrentUser } from "@/utils/hooks/useAuthentication";
import calcularTiempoFaltante from "@/utils/hooks/useTiempoFaltante";
import {
  LibroBibliotecaDetalle,
  librosBiblioteca,
  Prestamos,
} from "@/utils/types";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Pressable,
  View,
  Text,
  Button,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import Alerta from "@/components/Alerta";
import SuccesModal from "@/components/SuccesModal";
import { set } from "react-hook-form";

export default function PrestamosScreen() {
  const [prestamosUsuario, setPrestamosUsuario] = useState<Prestamos[]>();
  const [solicitudesUsuario, setSolicitudesUsuario] = useState<Prestamos[]>();
  const [prestamoDetalle, setPrestamoDetalle] = useState<
    LibroBibliotecaDetalle[]
  >([]);
  const [solicitudDetalle, setSolicitudDetalle] = useState<
    LibroBibliotecaDetalle[]
  >([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [tabs, setTabs] = useState<"prestamos" | "solicitudes">("prestamos");
  const [loadingBoton, setLoadingBoton] = useState<boolean>(false);

  const [alerta, setAlerta] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  const [varianteAlerta, setVarianteAlerta] = useState<
    "Informante" | "Exitoso" | "Advertencia"
  >("Informante");

  const [modal, setModal] = useState<boolean>(false);
  const [mensajeModal, setMensajeModal] = useState<string>("");
  const [funcion, setFuncion] = useState<() => void>();

  const router = useRouter();

  const obtenerPrestamosYLibros = async () => {
    const auth = await CurrentUser();
    try {
      const prestamos = await obtenerPrestamosDelUsuario(auth.localId);
      setPrestamosUsuario(prestamos);

      // Obtener detalles de cada libro relacionado al préstamo
      const detallesLibros = await Promise.all(
        prestamos.map(async (prestamo) => {
          return await getLibroAmigo(
            prestamo.fields?.id_dueno_libro.stringValue,
            prestamo.fields?.id_libro.stringValue
          );
        })
      );

      setPrestamoDetalle(
        detallesLibros.filter(
          (libro) => libro !== undefined
        ) as LibroBibliotecaDetalle[]
      );
    } catch (erro) {
      console.log(erro);
    }
  };

  const obtenerSolicitudYLibro = async () => {
    try {
      const prestamos = await obtenerSolicitudes();
      setSolicitudesUsuario(prestamos);

      // Obtener detalles de cada libro relacionado al préstamo
      const detallesLibros = await Promise.all(
        prestamos.map(async (prestamo) => {
          return await getLibroAmigo(
            prestamo.fields?.id_dueno_libro.stringValue,
            prestamo.fields?.id_libro.stringValue
          );
        })
      );
      setSolicitudDetalle(
        detallesLibros.filter(
          (libro) => libro !== undefined
        ) as LibroBibliotecaDetalle[]
      );
    } catch (erro) {}
  };

  useFocusEffect(
    useCallback(() => {
      obtenerPrestamosYLibros();
      obtenerSolicitudYLibro();
    }, [])
  );

  const handleRefresh = async () => {
    setRefresh(true);
    setPrestamosUsuario(undefined);
    setSolicitudesUsuario(undefined);
    setPrestamoDetalle([]);
    setSolicitudDetalle([]);
    await obtenerPrestamosYLibros();
    await obtenerSolicitudYLibro();
    setRefresh(false);
  };

  const handleSolicitud = async () => {
    setTabs("solicitudes");
  };
  const hanleAceptarSolicitud = async (idAmigo: string, idPrestamo: string) => {
    try {
      await aceptarSolicitud(idAmigo, idPrestamo);
      setAlerta(true);
      setMensaje("Solicitud aceptada");
      setVarianteAlerta("Exitoso");
      handleRefresh();
    } catch (err) {
      alert(err);
    }
  };
  const hanleRechazarSolicitud = async (
    idAmigo: string,
    idPrestamo: string,
    idLibro: string
  ) => {
    try {
      await rechazarSolicitud(idAmigo, idPrestamo, idLibro);
      setAlerta(true);
      setMensaje("Solicitud rechazada");
      setVarianteAlerta("Exitoso");
      handleRefresh();
    } catch (err) {
      alert(err);
    }
  };
  const handleReenviar = async (
    idAmigo: string,
    idPrestamo: string,
    idLibro: string
  ) => {
    try {
      await volverASolicitar(idAmigo, idPrestamo, idLibro);
      setAlerta(true);
      setMensaje("Volviste a enviar la solicitud");
      setVarianteAlerta("Exitoso");
      handleRefresh();
    } catch (err) {
      alert(err);
    }
  };

  const handleDevolver = async (idPrestamo: string) => {
    try {
      setLoadingBoton(true);
      await devolverLibro(idPrestamo);
      setAlerta(true);
      setMensaje("Devolviste un libro");
      setVarianteAlerta("Exitoso");
      handleRefresh();
      setLoadingBoton(false);
    } catch (err) {
      setAlerta(true);
      setMensaje((err as Error).message);
      setVarianteAlerta("Advertencia");
      setLoadingBoton(false);
    }
  };
  const handleBorrarPedido = async (idPrestamo: string) => {
    try {
      await borrarPrestamo(idPrestamo);
      setAlerta(true);
      setMensaje("Borraste un pedido");
      setVarianteAlerta("Exitoso");
      handleRefresh();
    } catch (err) {
      setAlerta(true)
      setMensaje((err as Error).message);
      setVarianteAlerta("Advertencia");
    }
  };
  console.log("Todas las solicitudes => ", solicitudesUsuario);
  console.log("Todas los prestamos: => ", prestamosUsuario);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#E8EBF7", position: "relative" }}
    >
      <View style={style.barraSuperior}>
        <Text style={style.barraTexto}>Préstamos y Solicitudes</Text>
      </View>

      <View style={style.contenedorBtnPrestamoSolicitud}>
        <Pressable
          style={[
            style.btnTab,
            tabs === "prestamos" ? style.btnActivo : style.btnInactivo,
          ]}
          onPress={() => setTabs("prestamos")}
        >
          <Text
            style={[
              style.btnTexto,
              tabs === "prestamos" && { color: "#000000ff" }, // texto naranja si activo
            ]}
          >
            Préstamos
          </Text>
        </Pressable>

        <Pressable
          style={[
            style.btnTab,
            tabs === "solicitudes" ? style.btnActivo : style.btnInactivo,
          ]}
          onPress={handleSolicitud}
        >
          <Text
            style={[
              style.btnTexto,
              tabs === "solicitudes" && { color: "#000000ff" },
            ]}
          >
            Solicitudes
          </Text>
        </Pressable>
      </View>

      {tabs === "prestamos" ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
          }
        >
          <View style={style.container_card}>
            {prestamosUsuario && prestamosUsuario.length > 0 ? (
              prestamoDetalle.map((libro, index) => {
                const prestamo = prestamosUsuario[index];
                const prestamoID = prestamo?.name?.split("/").pop() || "";
                const rechazado =
                  prestamo.fields?.estado?.stringValue === "rechazado";

                const pendiente_devolucion =
                  prestamo.fields?.estado_devolucion?.stringValue ===
                  "pendiente";
                const pendiente =
                  prestamo.fields?.estado?.stringValue === "pendiente";

                const aceptado =
                  prestamo.fields?.estado?.stringValue === "aceptado";

                const tiempoFaltante = aceptado
                  ? calcularTiempoFaltante(
                      prestamo.fields?.fecha_devolucion?.timestampValue
                    )
                  : null;
                if (pendiente_devolucion) {
                  return (
                    <View
                      key={index}
                      style={[
                        style.cartaPrestamos,
                        {
                          borderColor: rechazado
                            ? "#fcc5c5ff"
                            : pendiente
                            ? "#999999"
                            : "#a8ffa8",
                          borderWidth: 4,
                        },
                      ]}
                    >
                      <CartaSolicitud
                        imagen={libro.imagen_url.stringValue}
                        titulo_libro={prestamo.fields.titulo_libro.stringValue}
                        dueno={prestamo.fields.nombre_dueno.stringValue}
                        mensaje={prestamo.fields.mensaje.stringValue}
                        estado={prestamo.fields.estado.stringValue}
                        tiempo={tiempoFaltante}
                      />
                      {rechazado && (
                        <View style={style.container_boton}>
                          <Boton
                            loading={loadingBoton}
                            titulo="Solicitar"
                            variante="Primario"
                            icon={
                              <Entypo name="back" size={24} color="white" />
                            }
                            onPress={() => {
                              setModal(true);
                              setMensajeModal(
                                "Tas seguro que quieres volver a solicitar el libro"
                              );
                              setFuncion(() => () => {
                                handleReenviar(
                                  prestamo.fields.id_dueno_libro.stringValue,
                                  prestamoID,
                                  prestamo.fields.id_libro.stringValue
                                );
                              });
                            }}
                          />
                          <Boton
                            titulo="Borrar Pedido"
                            variante="Terciario"
                            icon={
                              <Entypo name="cross" size={24} color="white" />
                            }
                            onPress={() => {
                              setModal(true);
                              setMensajeModal(
                                "Estas Seguro de Borrar el pedido, tendras que volover a pedirlo en la bilioteca del amigo"
                              );
                              setFuncion(() => () => {
                                handleBorrarPedido(prestamoID);
                              });
                            }}
                          />
                        </View>
                      )}
                      {aceptado && (
                        <View style={style.container_boton}>
                          <Boton
                            loading={loadingBoton}
                            titulo="Devolver libro"
                            variante="Secundario"
                            icon={
                              <FontAwesome
                                name="send"
                                size={24}
                                color="#0077b6"
                              />
                            }
                            onPress={() => {
                              setModal(true);
                              setMensajeModal(
                                "Aun estas a tiempo, quieres devolver el libro?"
                              );
                              setFuncion(() => () => {
                                handleDevolver(prestamoID);
                              });
                            }}
                          />
                        </View>
                      )}
                    </View>
                  );
                }
                return null;
              })
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                No hay prestamos
              </Text>
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
          }
        >
          <View style={style.container_card}>
            {solicitudesUsuario && solicitudesUsuario.length > 0 ? (
              solicitudDetalle.map((libro, index) => {
                const prestamo = solicitudesUsuario[index];
                const prestamoID = prestamo?.name?.split("/").pop() || "";
                const rechazado =
                  prestamo.fields?.estado?.stringValue === "rechazado";

                const pendiente =
                  prestamo.fields?.estado?.stringValue === "pendiente";

                if (pendiente) {
                  return (
                    <View
                      key={index}
                      style={[
                        style.cartaPrestamos,
                        {
                          borderColor: rechazado
                            ? "#fcc5c5ff"
                            : pendiente
                            ? "#999999"
                            : "#a8ffa8",
                          borderWidth: 4,
                        },
                      ]}
                    >
                      <CartaSolicitud
                        imagen={libro.imagen_url.stringValue}
                        titulo_libro={libro.titulo.stringValue}
                        quien={prestamo.fields.nombre_usuario.stringValue}
                        mensaje={prestamo.fields.mensaje.stringValue}
                        estado={prestamo.fields.estado.stringValue}
                        ubicacion={prestamo.fields.ubicacion.stringValue}
                        estadoSolicitud={
                          prestamo.fields.estado_devolucion.stringValue
                        }
                      />
                      <Boton
                        titulo="Aceptar"
                        variante="Primario"
                        onPress={() => {
                          setModal(true);
                          setMensajeModal(
                            "Estas seguro que quieres aceptar la solicitud?"
                          );
                          setFuncion(
                            () => () =>
                              hanleAceptarSolicitud(
                                prestamo.fields.id_usuario.stringValue,
                                prestamoID
                              )
                          );
                        }}
                      />
                      <Boton
                        titulo="Rechazar"
                        variante="Terciario"
                        onPress={() => {
                          setModal(true);
                          setMensajeModal(
                            "Estas seguro que quieres rechazar la solicitud?"
                          );
                          setFuncion(
                            () => () =>
                              hanleRechazarSolicitud(
                                prestamo.fields.id_usuario.stringValue,
                                prestamoID,
                                prestamo.fields.id_libro.stringValue
                              )
                          );
                        }}
                      />
                    </View>
                  );
                }
                return null;
              })
            ) : (
              <Text
              style={{
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: "bold",
                }}>No hay solicitudes</Text>
            )}
          </View>
        </ScrollView>
      )}
      <Alerta
        visible={alerta}
        variante={varianteAlerta}
        mensaje={mensaje}
        onHide={() => setAlerta(false)}
      />
      <SuccesModal
        visible={modal}
        mensaje={mensajeModal}
        rechazar={() => setModal(false)}
        aceptar={() => {
          setModal(false);
          funcion?.();
        }}
      />
    </SafeAreaView>
  );
}

// estlos para la pantalla de prestamos
const style = StyleSheet.create({
  barraSuperior: {
    width: "100%",
    height: 56, // o 60, como prefieras
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff", // Mejor blanco para sombra visible
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 4,
  },
  barraTexto: {
    color: "#0056b3",
    fontSize: 18,
    fontWeight: "bold",
  },
  contenedorBtnPrestamoSolicitud: {
    flexDirection: "row",
    backgroundColor: "#cbd4f7ff",
    padding: 7,
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 15,
    height: 50,
    //sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    //sombra para Android
    elevation: 2,
  },
  btnTab: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 4,
    alignItems: "center",
    height: "100%",
  },
  btnActivo: {
    backgroundColor: "#FCFDFF",
  },
  btnInactivo: {
    backgroundColor: "#ccd3eeff",
  },
  btnTexto: {
    color: "#0056b3",
    fontWeight: "bold",
    fontSize: 16,
  },
  cartaPrestamos: {
    padding: 20,
    backgroundColor: "#ffff",
    borderRadius: 16,
  },
  container_card: {
    padding: 10,
    gap: 10,
  },
  container_boton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 12,
    borderTopColor: "gray",
    borderTopWidth: 1,
    padding: 10,
  },
});
