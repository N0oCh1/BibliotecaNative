import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { AntDesign, Fontisto, MaterialIcons } from "@expo/vector-icons";
import { singUp } from "@/api/useSesion";
import { setDocument } from "@/api/useFirestore";
import { array } from "yup";
import { agregarUsuario } from "@/api/usuarios";

const { width, height } = Dimensions.get("window");

export default function Registro() {
  const [usuario, setUsuario] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repitePassword, setRepitePassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Estados para mostrar/ocultar contraseñas
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarRepitePassword, setMostrarRepitePassword] = useState(false);

  // Estados para el ojo activo
  const [ojoActivoPassword, setOjoActivoPassword] = useState(false);
  const [ojoActivoRepitePassword, setOjoActivoRepitePassword] = useState(false);

  // Estado para detectar si el teclado está visible
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const registrar = async () => {
    try {
      const user = await singUp(email, password);
      const uid = user.localId;

      if (user) {
        await agregarUsuario(usuario);
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("Error al registrar:", error);
      setError("Error al crear cuenta. ");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Image
          source={require("../assets/bienvenido/heroBienvenido.png")}
          style={[styles.image, keyboardVisible && styles.imageKeyboardVisible]}
          resizeMode="cover"
        />
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Registrarse</Text>

          <View style={styles.inputContainerpadre}>
            <Text style={styles.subtitulo}>Usuario</Text>
            <View style={styles.inputContainer}>
              <AntDesign name="user" size={20} color={"#333333"} />
              <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                value={usuario}
                onChangeText={(text) => {
                  setUsuario(text);
                  setError(null);
                }}
              />
            </View>

            <Text style={styles.subtitulo}>Correo</Text>
            <View style={styles.inputContainer}>
              <Fontisto name="email" size={20} color={"#333333"} />
              <TextInput
                style={styles.input}
                placeholder="alguien@gmail.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                }}
              />
            </View>

            <Text style={styles.subtitulo}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="password" size={24} color={"#333333"} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError(null);
                }}
                secureTextEntry={!mostrarPassword}
              />
              <Pressable
                onPress={() => {
                  setMostrarPassword(!mostrarPassword);
                  setOjoActivoPassword(!ojoActivoPassword);
                }}
              >
                <AntDesign
                  name={"eyeo"}
                  size={20}
                  color={ojoActivoPassword ? "#0353ff" : "#5f5f5f"}
                />
              </Pressable>
            </View>

            <Text style={styles.subtitulo}>Repite la contraseña</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="password" size={24} color={"#333333"} />
              <TextInput
                style={styles.input}
                placeholder="Repite la contraseña"
                value={repitePassword}
                onChangeText={(text) => {
                  setRepitePassword(text);
                  setError(null);
                }}
                secureTextEntry={!mostrarRepitePassword}
              />
              <Pressable
                onPress={() => {
                  setMostrarRepitePassword(!mostrarRepitePassword);
                  setOjoActivoRepitePassword(!ojoActivoRepitePassword);
                }}
              >
                <AntDesign
                  name={"eyeo"}
                  size={20}
                  color={ojoActivoPassword ? "#0353ff" : "#5f5f5f"}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.contenedorBoton}>
            <Pressable onPress={registrar} style={styles.button}>
              <Text style={styles.buttonText}>Crear Cuenta</Text>
            </Pressable>
          </View>
          <View style={styles.contenedorlink}>
            <Text style={styles.subtitulolink}>¿Ya tienes una cuenta? </Text>
            <Text style={styles.link} onPress={() => router.push("/login")}>
              Inicia sesión
            </Text>
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: width * 0.25,
  },
  content: {
    flex: 1,
    paddingTop: width * 0.45,
    paddingHorizontal: width * 0.05,
    paddingBottom: width * 0.05,
  },
  inputContainerpadre: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: width * 0.15,
    width: "96%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#397EE6",
    marginBottom: "5%",
    width: "100%",
  },
  title: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    marginBottom: width * 0.06,
    color: "#424242",
  },
  subtitulo: {
    fontSize: width * 0.042,
    fontWeight: "bold",
    marginBottom: 0,
    color: "#616161",
  },
  input: {
    width: "80%",
    padding: width * 0.025,
  },
  image: {
    width: width,
    height: width * 1.25,
    resizeMode: "cover",
    position: "absolute",
    top: -width * 0.35,
    left: 0,
  },
  // Nuevo estilo para cuando el teclado está visible
  imageKeyboardVisible: {
    top: -width * 0.65, // Ajusta este valor según necesites
  },
  contenedorBoton: {
    justifyContent: "center",
    width: "100%",
    marginTop: width * 0.05,
  },
  button: {
    backgroundColor: "#397EE6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.045,
  },
  contenedorlink: {
    flexDirection: "row",
    marginTop: width * 0.02,
    width: "100%",
    justifyContent: "center",
  },
  subtitulolink: {
    color: "#616161",
  },
  link: {
    marginTop: 0,
    color: "#397EE6",
  },
  ojoicon: {
    width: 20,
    height: 20,
    marginLeft: width * 0.07,
    marginTop: width * 0.05,
  },
  error: {
    marginTop: 10,
    color: "red",
  },
});
