import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
  Button,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCredencial } from "@/utils/hooks/useCredential";
import { singIn } from "@/api/useSesion";
import { actualizarToken } from "@/api/usuarios";

export default function WelcomeScreen() {
  const router = useRouter();

  
  
  // obtengo la sesion de guardado en storage 
  useFocusEffect(()=>{
    const getSessions = async () => {
      const session = await getCredencial();
      if(session){
        const user = await singIn(session.usuario, session.contrasena)
        if(user){
          await actualizarToken();
          router.replace("/(tabs)")
        }
      }
    }
    getSessions()
  })

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/bienvenido/heroBienvenido.png")}
        style={styles.image}
        resizeMode="cover"
      />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <SafeAreaView style={styles.content}>
        <View style={{ marginBottom: "auto" }}>
          {/* Texto de bienvenida */}
          <Text style={styles.title}>Bienvenido</Text>
        </View>
        
        <Pressable
          onPress={() => router.replace("/login")}
          style={{ alignSelf: "flex-end", marginTop: 20 }}
        >
          <View style={styles.contenedorBoton}>
            <Text style={styles.subtitle}>Continuar</Text>
            <Image
              source={require("../assets/bienvenido/arrow-icon.png")}
              style={styles.icon}
            />
          </View>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 500, // Ajusta según cuánto quieras que ocupe
    resizeMode: "cover", // Cubre todo el área sin distorsión
    position: "absolute", // Para que quede detrás del contenido si quieres
    top: 0,
    left: 0,
  },
  icon: {
    width: 36,
    height: 36,
    resizeMode: "contain", // 🔥 Esto es lo clave para evitar que se corte
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 40,
    marginLeft: 0,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 14,
    color: "#9E9E9E",
    fontWeight: "bold",
    textAlign: "center",
  },

  contenedorBoton: {
    flexDirection: "row", // Alinea los elementos en fila
    alignItems: "center", // centra verticalmente (en dirección cruzada)
    justifyContent: "space-between", // centra horizontalmente (en dirección principal)
    height: "auto", // ajusta según tu diseño
    width: "32%", // o el valor que necesites
    marginBottom: 50,
  },

  content: {
    flex: 1,
    paddingTop: 420,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
