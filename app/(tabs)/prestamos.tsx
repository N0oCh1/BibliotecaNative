import { getLibroAmigo } from "@/api/biblioteca";
import {
  aceptarSolicitud,
  obtenerPrestamosDelUsuario,
  obtenerSolicitudes,
  rechazarSolicitud,
} from "@/api/prestarLibro";
import { CurrentUser } from "@/utils/hooks/useAuthentication";
import {
  LibroBibliotecaDetalle,
  librosBiblioteca,
  Prestamos,
} from "@/utils/types";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, Button, ScrollView, RefreshControl } from "react-native";
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

      // Obtener detalles de cada libro relacionado al préstamo
      const detallesLibros = await Promise.all(
        prestamos.map(async (prestamo) => {
          return await getLibroAmigo(
            prestamo.fields.dueno_libro.stringValue,
            prestamo.fields.libro.stringValue
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
            prestamo.fields.dueno_libro.stringValue,
            prestamo.fields.libro.stringValue
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

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <View>
        <Button title="Prestamos" onPress={() => setTabs("prestamos")} />
        <Button title="Solicitudes" onPress={() => handleSolicitud()} />
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
              const prestamoID = prestamo.name.split("/").pop();

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
                </View>
              );
            })
          ) : (
            <Text>No hay prestamos</Text>
          )}
        </ScrollView>
      ) : (
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
              if (prestamo.fields.estado.stringValue === "pendiente") {
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
                    <Button
                      title="Aceptar"
                      onPress={() =>
                        hanleAceptarSolicitud(
                          prestamo.fields.usuario.stringValue,
                          prestamoID
                        )
                      }
                    />
                    <Button
                      title="Rechazar"
                      onPress={() =>
                        hanleRechazarSolicitud(
                          prestamo.fields.usuario.stringValue,
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
