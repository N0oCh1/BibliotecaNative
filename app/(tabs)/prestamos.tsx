import { getLibroAmigo } from "@/api/biblioteca";
import {
  aceptarSolicitud,
  devolverLibro,
  obtenerPrestamosDelUsuario,
  obtenerSolicitudes,
  rechazarSolicitud,
  volverASolicitar,
} from "@/api/prestarLibro";
import { obtenerUsuario } from "@/api/usuarios";
import { CurrentUser } from "@/utils/hooks/useAuthentication";
import calcularTiempoFaltante from "@/utils/hooks/useTiempoFaltante";
import {
  LibroBibliotecaDetalle,
  librosBiblioteca,
  Prestamos,
} from "@/utils/types";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {Pressable, View, Text, Button, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const obtenerPrestamosYLibros = async () => {
    const auth = await CurrentUser();
    try {
      const prestamos = await obtenerPrestamosDelUsuario(auth.localId);
      setPrestamosUsuario(prestamos);
      console.log(prestamos);

      // Obtener detalles de cada libro relacionado al préstamo
      const detallesLibros = await Promise.all(
        prestamos.map(async (prestamo) => {
          return await getLibroAmigo(
            prestamo.fields.id_dueno_libro?.stringValue,
            prestamo.fields.id_libro?.stringValue
          );
        })
      );

      setPrestamoDetalle(
        detallesLibros.filter(
          (libro) => libro !== undefined
        ) as LibroBibliotecaDetalle[]
      );
    } catch (erro) {}
  };

  const obtenerSolicitudYLibro = async () => {
    try {
      const prestamos = await obtenerSolicitudes();
      setSolicitudesUsuario(prestamos);

      // Obtener detalles de cada libro relacionado al préstamo
      const detallesLibros = await Promise.all(
        prestamos.map(async (prestamo) => {
          return await getLibroAmigo(
            prestamo.fields.id_dueno_libro.stringValue,
            prestamo.fields.id_libro.stringValue
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
      alert("Solicitud aceptada");
      handleRefresh();
    } catch (err) {
      alert(err);
    }
  };
  const hanleRechazarSolicitud = async (
    idAmigo: string,
    idPrestamo: string
  ) => {
    try {
      await rechazarSolicitud(idAmigo, idPrestamo);
      alert("Solicitud rechazada");
      handleRefresh();
    } catch (err) {
      alert(err);
    }
  };
  const handleReenviar = async(
    idAmigo: string,
    idPrestamo: string
  ) =>{
    try{
      await volverASolicitar(idAmigo, idPrestamo)
      alert("Volviste a enviar la solicitud");
      handleRefresh();
    }
    catch(err){
      alert(err);
    }
  }

  const handleDevolver = async(idPrestamo: string) =>{
    try{
      await devolverLibro(idPrestamo)
      alert("Devolviste un libro")
      handleRefresh();
    }
    catch(err){
      alert(err);
    }
  }
  console.log(prestamoDetalle)
  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >

      <View  style={style.barraSuperior}>
        <Text style={style.barraTexto}>
          Préstamos y Solicitudes
        </Text>
      </View>

      <View style={style.contenedorBtnPrestamoSolicitud}>
        <Pressable
          style={[
            style.btnTab,
            tabs === "prestamos" ? style.btnActivo : style.btnInactivo
          ]}
          onPress={() => setTabs("prestamos")}
        >
          <Text
            style={[
              style.btnTexto,
              tabs === "prestamos" && { color: "#000000ff" } // texto naranja si activo
            ]}
          >
            Préstamos
          </Text>
        </Pressable>

        <Pressable
          style={[
            style.btnTab,
            tabs === "solicitudes" ? style.btnActivo : style.btnInactivo
          ]}
          onPress={handleSolicitud}
        >
          <Text
            style={[
              style.btnTexto,
              tabs === "solicitudes" && { color: "#000000ff" }
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
          {prestamosUsuario ? (
            
            prestamoDetalle.map((libro, index) => {
              const prestamo = prestamosUsuario[index];
              const prestamoID = prestamo.name.split("/").pop() || "";
              console.log(prestamo)
              if(prestamo.fields.estado_devolucion.stringValue === "pendiente"){
              return (
                <View key={index}>
                  <Image
                    source={{ uri: libro.imagen_url.stringValue }}
                    style={{ width: 50, height: 75 }}
                  />
                  <Text>idPrestamo: {prestamoID}</Text>
                  <Text>Libro: {libro.titulo.stringValue}</Text>
                  <Text>Usuario: {libro.quien_agrego.stringValue}</Text>
                  <Text>
                    Estado de solicitud: {prestamo.fields.estado.stringValue}
                  </Text>
                  <Text>
                    Ubicacion: {prestamo.fields.ubicacion.stringValue}
                  </Text>
                  <Text>Mensajes: {prestamo.fields.mensaje.stringValue}</Text>
                  {prestamo.fields.estado.stringValue === "rechazado" 
                  && <Button title="Volver a pedir" onPress={()=>handleReenviar(prestamo.fields.id_usuario.stringValue, prestamoID)}/> 
                  }
                  {prestamo.fields.estado.stringValue === "aceptado" &&
                    <View>
                      <Text>Tiempo faltante: {calcularTiempoFaltante(prestamo.fields.fecha_devolucion.timestampValue)}</Text>
                      <Button title="Devolver el libro" onPress={()=>{handleDevolver(prestamoID)}}/>
                    </View>
                  }
                </View>
              );}
              return null;
            })
          ) : (
            <Text style={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}>No hay prestamos</Text>
          )}
        </ScrollView>
      ) 
      : 
      (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
          }
        >
          <Text
            style={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}
          >
            Solicitudes
          </Text>
          {solicitudesUsuario ? (
            solicitudDetalle.map((libro, index) => {
              const prestamo = solicitudesUsuario[index];
              const prestamoID = prestamo.name.split("/").pop() || "";
              if (
                prestamo.fields.estado.stringValue === "pendiente" 
              ) {
                return (
                  <View key={index}>
                    <Image
                      source={{ uri: libro.imagen_url.stringValue }}
                      style={{ width: 50, height: 75 }}
                    />
                    <Text>idPrestamo: {prestamoID}</Text>
                    <Text>Libro: {libro.titulo.stringValue}</Text>
                    <Text>Usuario: {prestamo.fields.nombre_usuario.stringValue}</Text>
                    <Text>
                      Estado de solicitud: {prestamo.fields.estado.stringValue}
                    </Text>
                    <Text>
                      Ubicacion: {prestamo.fields.ubicacion.stringValue}
                    </Text>
                    <Text>Mensajes: {prestamo.fields.mensaje.stringValue}</Text>
                    <Button
                      title="Aceptar"
                      onPress={() =>
                        hanleAceptarSolicitud(
                          prestamo.fields.id_usuario.stringValue,
                          prestamoID
                        )
                      }
                    />
                    <Button
                      title="Rechazar"
                      onPress={() =>
                        hanleRechazarSolicitud(
                          prestamo.fields.id_usuario.stringValue,
                          prestamoID
                        )
                      }
                    />
                  </View>
                );
              }
              return null;
            })
          ) : (
            <Text>No hay solicitudes</Text>
          )}
        </ScrollView>
      )}
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
    barraTexto:{
    color: "#0056b3",
    fontSize: 18,
    fontWeight: "bold",
  },
  contenedorBtnPrestamoSolicitud: {
    flexDirection: "row",
    backgroundColor: "#d9dcf2ff",
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
    height: '100%',
  },
  btnActivo: {
    backgroundColor: "#ebedf4ff",
  },
  btnInactivo: {
    backgroundColor: "#d9dcf2ff",
  },
  btnTexto: {
    color: "#0056b3",
    fontWeight: "bold",
    fontSize: 16,
  },
  
});