import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "react-native";


export const options = {
    headerShown: false,
};
  
export default function Login() {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [secure, setSecure] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);




    const signIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                email!,
                password!
            );
            if (user) router.replace("/(tabs)");
        } catch (error) {
            console.error("Error signing in:", error);
            setError("Correo o contraseña incorrectos");
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/bienvenido/heroBienvenido.png")} // asegúrate de tener esta imagen
                style={styles.header}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.form}>
                    <Text style={styles.title}>Iniciar sesión</Text>

                    <Text style={styles.label}>Correo</Text>
                    <View
                        style={[
                            styles.inputContainer,
                            {
                                borderBottomColor: emailFocused
                                    ? "#397EE6"
                                    : "#ccc",
                            }, // azul cuando está enfocado
                        ]}
                    >
                        <Image
                            source={require("../assets/login/mail-02 - 24px (1).png")}
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="alguien@gmail.com"
                            placeholderTextColor="#BDBDBD"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setError(null);
                            }}
                            keyboardType="email-address"
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                        />
                    </View>

                    <Text style={styles.label}>Contraseña</Text>
                    <View
                        style={[
                            styles.inputContainer,
                            {
                                borderBottomColor: passwordFocused
                                    ? "#397EE6"
                                    : "#ccc",
                            },
                        ]}
                    >
                        <Image
                            source={require("../assets/login/lock - 24px (2).png")}
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="ingrese su contraseña"
                            placeholderTextColor="#BDBDBD"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setError(null);
                            }}
                            secureTextEntry={secure}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                        />
                    </View>

                    <View style={styles.options}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.checkbox,
                                    checked && styles.checkboxChecked, // aplica estilo adicional si está activo
                                ]}
                                onPress={() => setChecked(!checked)}
                            >
                                {checked && (
                                    <MaterialIcons
                                        name="check"
                                        size={14}
                                        color="white"
                                    />
                                )}
                            </TouchableOpacity>

                            <Text
                                style={[
                                    styles.recuerdame,
                                    { color: checked ? "#616161" : "#9E9E9E" }, // azul si está marcado
                                ]}
                            >
                                recuerdame
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.forgot}>
                                ¿Olvidó su contraseña?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 50, justifyContent: "center" }}>
                        {error && (
                            <View style={styles.errorBox}>
                                <MaterialIcons
                                    name="error-outline"
                                    size={20}
                                    color="#D32F2F"
                                />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity onPress={signIn} style={styles.button}>
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/signup")}>
                        <Text style={styles.register}>
                            ¿No tienes una cuenta?{" "}
                            <Text style={styles.registerLink}>Registrarse</Text>
                        </Text>
                    </TouchableOpacity>
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
    header: {
        width: "100%",
        height: 500, // Ajusta según cuánto quieras que ocupe
        resizeMode: "cover", // Cubre todo el área sin distorsión
        position: "absolute", // Para que quede detrás del contenido si quieres
        top: -160,
        left: 0,
    },
    form: {
        marginTop: 285, // antes -40

        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        flex: 1,
        zIndex: 10,
    },
    title: {
        fontSize: 38,
        fontWeight: "bold",
        marginBottom: 25,
        color: "#424242",
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
        color: "#616161",
        fontWeight: "bold",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,

        paddingBottom: 5,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 8,
        color: "#616161",
        fontWeight: "bold",
    },
    options: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 85,
    },
    forgot: {
        color: "#397EE6",
        fontSize: 14,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#397EE6",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    register: {
        textAlign: "center",
        color: "#616161",
        marginTop: 15,
    },
    registerLink: {
        color: "#397EE6",
        fontWeight: "bold",
    },

    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: "#9E9E9E",
        borderRadius: 4,
    },

    recuerdame: {
        marginLeft: 6,
        fontWeight: "bold",
        color: "#616161",
    },
    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FDECEA",
        borderWidth: 1,
        borderColor: "#F5C6CB",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: -10,
        gap: 10,
    },
    errorText: {
        color: "#D32F2F",
        fontWeight: "bold",
        fontSize: 14,
        flexShrink: 1,
    },
    checkboxChecked: {
        backgroundColor: "#397EE6",
        borderColor: "#397EE6",
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        width: 18,
        height: 18,
        resizeMode: "contain",
        tintColor: "#888", // opcional: puedes eliminar esta línea si el ícono ya tiene el color adecuado
        marginRight: 4,
    },
});
  