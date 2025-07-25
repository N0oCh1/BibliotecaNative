import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Button,
} from "react-native";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { CurrentUser } from "@/utils/hooks/useAuthentication";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { buscarAmigo, insertarAmigo, obtenerMisAmigos } from "@/api/amigos";
import { Amigos, LibroBibliotecaDetalle, Prestamos } from "@/utils/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLibroAmigo } from "@/api/biblioteca";
import { obtenerSolicitudes } from "@/api/prestarLibro";
import calcularTiempoFaltante from "@/utils/hooks/useTiempoFaltante";

export default function AmigosScreen() {
  const route = useRouter();
  const { control, handleSubmit, reset } = useForm();
  const [userId, setUserId] = useState<string>();
  const [detalleAmigos, setDetalleAmigos] = useState<Amigos[] | undefined>();
  const [solicitudesUsuario, setSolicitudesUsuario] = useState<Prestamos[]>();
  const [solicitudDetalle, setSolicitudDetalle] = useState<
    LibroBibliotecaDetalle[]
  >([]);
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

  // Obtenmer id del usuario para compartir con amigos
  useFocusEffect(() => {
    const obtenerUsuario = async () => {
      const authData = await CurrentUser();
      try {
        
        setUserId(authData.localId);
      } catch (err) {
      }
    };
    const obtenerLibros = async()=>{
      try{
        obtenerSolicitudYLibro();
        setDetalleAmigos(await obtenerMisAmigos());
      }
      catch(erro){
      }
    }
    obtenerUsuario();
    obtenerLibros();
  });

  // Buscar amigo para agregar a amigos
  const onSubmit = async (data: any) => {
    try {
      const amigos = await buscarAmigo(data.search);
      if (amigos && amigos.length > 0) {
        await insertarAmigo(amigos[0]);
      }
    } catch (err: unknown) {
      alert((err as Error).message);
    }
    reset();
  };

  
  const verBiblioteca = (id: string, username:string) => {
    console.log(id, username)
    route.push({ pathname: `/bibliotecaAmigo/${id}`, params: { username } });
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
        <View style={styles.container}>
          <View>
            <Text>user id del usuario logiado: {userId}</Text>
            <View style={styles.searchContainer}>
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
                <AntDesign name="search1" size={24} color="white" />
              </Pressable>
            </View>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 2, paddingBottom: 100 }}>
          {detalleAmigos && detalleAmigos.length > 0 ? (
            detalleAmigos.map((amigo, index) => (
              <View key={index} style={{ padding: 10 }}>
                <Text>{amigo.nombre}</Text>
                <Button
                  title="Ver Biblioteca"
                  onPress={() => verBiblioteca(amigo.id, amigo.nombre)}
                />
              </View>
            ))
          ) : (
            <Text style={{ padding: 10 }}>No tienes amigos agregados.</Text>
          )}

          {solicitudesUsuario ? (
            solicitudDetalle.map((libro, index) => {
              const prestamo = solicitudesUsuario[index];
              const prestamoID = prestamo.name.split("/").pop() || "";
              if (prestamo.fields.estado.stringValue === "aceptado") {
                return (
                  <View key={index} style={{ padding: 10 }}>
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
                    <Text>Tiempo faltante: {calcularTiempoFaltante(prestamo.fields.fecha_devolucion.timestampValue)}</Text>
                  </View>
                );
              }
              return null;
            })
          ) : (
            <Text>No hay solicitudes</Text>
          )}
           </ScrollView>
        </View>
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
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  input: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    borderWidth: 2,
    borderColor: "#ccc",
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
  }
});
