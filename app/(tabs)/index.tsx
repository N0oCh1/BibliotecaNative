import React, { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Text, View,StyleSheet, ScrollView, RefreshControl} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCredencial, removeCredencial } from "@/utils/hooks/useCredential";
import { CurrentUser, removeCurrentUser } from "@/utils/hooks/useAuthentication";
import type {  Credenciale, LibroBibliotecaDetalle } from "@/utils/types";
import { obtenerNombreUsuario } from "@/api/usuarios";
import { getBiblioteca } from "@/api/biblioteca";
import { StatusBar } from "react-native";
import {  useState } from "react";
import { NotificationMode, registerForPushNotificationsAsync } from "@/utils/hooks/useNotification";
import Alerta from "@/components/Alerta";
import { Alert } from 'react-native'; 
import LibroPresentacion from "@/components/LibroPresentacion";
import Boton from "@/components/Boton";
import Entypo from '@expo/vector-icons/Entypo';

NotificationMode("prod")
export default function HomeScreen() {
  const [usuario, setUsuario] = useState<string>()
  const [pressed, setPressed] = useState<boolean>(false)
  const [biblioteca, setBibilioteca] = useState<LibroBibliotecaDetalle[]>()
  const [refresh, setRefresh] = useState<boolean>(false)
  const [credential, setCredential] = useState<Credenciale|null>();

  const [alerta, setAlerta] = useState<boolean>(false)
  const [mensaje, setMensaje] = useState<string>("")


  const route = useRouter();
  const auth = CurrentUser();

 const cerrarSesion = async () => {
     // Mostrar la alerta de confirmación
     Alert.alert(
         "Cerrar sesión", // Título de la alerta
         "¿Estás seguro de que deseas cerrar sesión?", // Mensaje de la alerta
         [
             {
                 text: "Cancelar", // Botón para cancelar
                 onPress: () => console.log("Cierre de sesión cancelado"), // Acción de cancelar
                 style: "cancel", // Estilo del botón de cancelar
             },
             {
                 text: "Cerrar sesión", // Botón para confirmar
                 onPress: async () => {
                     // Si el usuario confirma
                     setPressed(false); // Resetear estado de presionado
                     await removeCredencial(); // Eliminar las credenciales
                     await removeCurrentUser(); // Eliminar el usuario actual
                     route.push("/login"); // Redirigir al login
                 },
             },
         ],
         { cancelable: false } // Deshabilita cerrar la alerta tocando fuera de ella
     );
 };
  // cargar datos al focucear la pagina principal
    useFocusEffect(
    useCallback(() => {
      
      const getUsuario = async () => {
        const authData = await auth; 
        if (authData) {
          setUsuario(await obtenerNombreUsuario())
        } else {
        }
      };
      const getCredential = async()=>{
        await registerForPushNotificationsAsync().then((token) => {console.log("Token del usuario", token)})
        setCredential(await getCredencial())
      }
      const obtenerBiblioteca = async() =>{
        const auth = await CurrentUser()
        try{
          setBibilioteca(await getBiblioteca(auth.localId))
        }
        catch(e){
          setBibilioteca([])
        }
      }
      getCredential();
      getUsuario();
      obtenerBiblioteca();
      // Cleanup para evitar fugas de memoria
    }, []) // 🚨 IMPORTANTE: array vacío si no depende de variables del componente
  );

  const handleRefresh = async() => {

      setRefresh(true);
      const user = await auth;
      setUsuario(await obtenerNombreUsuario());
      setBibilioteca(await getBiblioteca(user.localId))
      setRefresh(false)

  }
  const handleDetails = (id:string) =>{
    route.push(`/bibliotecaLibro/${id}`);
  }

  return (
    <View
    style={{
      flex: 1,
      backgroundColor: "#E8EBF7",
      position:"relative"
    }}
    >
    <StatusBar
    barStyle="dark-content"
    backgroundColor="#fff"
    translucent={false}
    />
      <SafeAreaView edges={['top']} style={{backgroundColor:"#fff"}}>
        <View  style={style.barraSuperior}>
          <Text style={style.barraTexto}>
            {usuario === undefined ? "Cargando..." : `Bienvenido, ${usuario}`}
          </Text>
          <Boton
            titulo="Cerrar Sesión"
            variante="Terciario"
            onPress={() => cerrarSesion()}
            icon = {<Entypo name="log-out" size={24} color="#ffff" />}
          />
        </View>
      </SafeAreaView>
      
      <ScrollView
        style={{ width: "100%", flex: 1, paddingTop: 8}}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={handleRefresh} />}
      >
        <Text style={style.tituloH1}>Tu Biblioteca</Text>
        <View style={style.gridContainer}>
          {biblioteca && biblioteca.map((libro:any,index:number)=>{
            const libroId = libro.name.split("/").pop();
            return(
              <LibroPresentacion
                key={index}
                imagen={libro.fields.imagen_url?.stringValue}
                titulo={libro.fields.titulo?.stringValue}
                autor={libro.fields.autor?.stringValue}
                onPress={()=>handleDetails(libroId)}
              />
            )
          })}
        </View>
      </ScrollView>
      <Alerta
        variante="Exitoso"
        visible={alerta}
        mensaje={mensaje}
        onHide={() => setAlerta(false)}
      />
    </View>
  );
}
const style = StyleSheet.create({
  barraSuperior: {
    width: "100%",
    height: 60, // o 60, como prefieras
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff", // Mejor blanco para sombra visible
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: '2%',
  },
  card: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    padding: '3%',
    backgroundColor: '#fff',
    marginBottom: '3%',
    // Sombra sutil para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    // Sombra sutil para Android
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
    borderRadius: 4,
  },

 descripcionLibro: {
    marginTop: '5%',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  tituloH1:{
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 1,
    color: "#0056b3", // Color azul para el título
  },
  author: {
    marginTop: 5, // Espacio entre título y autor
    fontSize: 12,
    textAlign: 'center',
    color: '#666', 
  },
  Button:{
    paddingVertical:6,
    paddingHorizontal:16,
    marginLeft:10,
    borderRadius: 4,
  },
  barraTexto:{
    color: "#0056b3",
    fontSize: 20,
    fontWeight: "bold",
  }

});
