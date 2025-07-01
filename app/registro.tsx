import { View, Text, TextInput, Pressable, StyleSheet, Image, StatusBar, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { KeyboardAvoidingView, Platform } from "react-native";

const { width } = Dimensions.get("window");


export default function Registro() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const registrar = async () => {
        try{
            const user = await createUserWithEmailAndPassword(auth, email, password);
            if(user) router.replace("/(tabs)");
        }catch (error) {
            console.log("Error al registrar:", error);
            setError("Error al crear cuenta. ");
        }
    };

     return (
    <View style={styles.content}>

            
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

            
                <SafeAreaView style={styles.container}>

                <Text style={styles.title}>Registrarse</Text>

                <View style={styles.inputContainerpadre}>

                    <Text style={styles.subtitulo}>Correo</Text>
                    <View style={styles.inputContainer}>
                        <Image
                        source={require("../assets/registrar/imagen-correo.png")}
                        style={styles.icon}
                        />
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
                        <Image
                        source={require("../assets/registrar/imagen-llave.png")}
                        style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            value={password}
                            onChangeText={(text) => {
                            setPassword(text);
                            setError(null);
                            }}
                            secureTextEntry
                        />
                    </View>

                    <Text style={styles.subtitulo}>Repite la contraseña</Text>
                    <View style={styles.inputContainer}>
                        <Image
                        source={require("../assets/registrar/imagen-llave.png")}
                        style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Repite la contraseña"
                            value={password}
                            onChangeText={(text) => {
                            setPassword(text);
                            setError(null);
                            }}
                            secureTextEntry
                        />
                    </View>
                </View>



                <View style={styles.contenedorBoton}>        
                    <Pressable onPress={registrar} style={styles.button}>
                        <Text style={styles.buttonText}>Crear Cuenta</Text>
                    </Pressable>
                </View>
                <View style={styles.contenedorlink}>
                        <Text style={styles.subtitulolink}>¿Ya tienes una cuenta?</Text>
                        <Text style={styles.link} onPress={() => router.push("/login")}>
                            Inicia sesión
                        </Text>
                </View>

                {error && <Text style={styles.error}>{error}</Text>}
                </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
    },
    inputContainerpadre: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#397EE6",
    marginTop: -15,
    marginBottom: 10,
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    marginBottom: 10,
    color: "#424242",
    },
    subtitulo:{
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 0,
    color: "#616161",
 
    },
  input: {
    width: "80%",
    marginTop: 12,
    padding: 10,
  },
  image:{
    width: width,
    height: 500,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  content:{
    flex: 1,
    paddingTop:200,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  icon:{
    marginRight:0,
    marginBottom: -12,
    width: 15,
    height:15,
  },
  contenedorBoton:{
    alignItems: "center",
    flexDirection: "column",

  },
  button: {
    marginTop: 20,
    backgroundColor: "#397EE6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: { 
    color: "white", 
    fontSize: 16 
  },
  contenedorlink:{
    flexDirection: "row",
    marginTop: 10,
  },
  subtitulolink:{
    color: "#616161",
  },
  link:{
    marginTop: 0,
    color: "#397EE6",
  },
  error: { 
    marginTop: 10, 
    color: "red" 
  },
});