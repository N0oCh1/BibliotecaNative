import { View, Text, Image, StyleSheet, Pressable, Dimensions, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
    const router = useRouter();
    return (
    <View style={styles.container}>
      <Image
        source={require("../assets/heroBienvenido.png")} 
        style={styles.image}
        resizeMode="cover"
      />
    <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

    <SafeAreaView style={styles.content}>
    <View style={{ marginBottom: "auto"}}>
      {/* Texto de bienvenida */}
      <Text style={styles.title}>Bienvenido Saramanbiche</Text>
      
    </View>
    <View style={styles.contenedorBoton}>
    <Text style={styles.subtitle}>Continuar</Text>
      <Pressable style={styles.button} onPress={() => router.replace("/login")}>        
        <Image
        source={require("../assets/arrow.png")} // Asegúrate de tener esta imagen en tu proyecto
        style={styles.icon}
        />
      </Pressable>
    </View>
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
    width: width,
    height: 500, // Ajusta según cuánto quieras que ocupe
    resizeMode: "cover", // Cubre todo el área sin distorsión
    position: "absolute", // Para que quede detrás del contenido si quieres
    top: 0,
    left: 0,
  },
  icon:{
    width: 30,
    height: 30,
    margin:0,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 0,
    marginLeft:0,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginTop: 10,
    marginBottom: 30,
    marginRight:-10,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 90,
    marginBottom: 20,
    marginLeft:"0%"
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
    contenedorBoton: {
    marginTop: "auto", // empuja el botón abajo
    width: "100%",     // para que el botón pueda centrarse
    alignItems: "center", // centra el botón horizontalmente
    flexDirection: "row",
    justifyContent: "flex-end", 
  },
    content: {
    flex: 1,
    justifyContent: "flex-start", // Contenido abajo
    alignItems: "flex-start", // Alinea el contenido al inicio osea a la izquierda
    paddingTop: 420,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});