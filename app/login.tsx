import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    Keyboard,
    Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";
import { MaterialIcons } from "@expo/vector-icons";


export const options = {
    headerShown: false,
};

export default function Login() {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [secure, setSecure] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Estado para detectar si el teclado está visible
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    
    useEffect(() => {
            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
                setKeyboardVisible(true);
            });
            const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                setKeyboardVisible(false);
            });
    
            return () => {
                keyboardDidHideListener?.remove();
                keyboardDidShowListener?.remove();
            };
        }, []);

    const router = useRouter();

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

    const Anonimus = async () => {
        try{
            const user = await signInAnonymously(auth);
            if(user){
                router.replace("/(tabs)")
            }
        }catch(error){
            console.error(error)
            setError("hubo un error de servidor")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <ImageBackground
                    source={require("../assets/bienvenido/heroBienvenido.png")}
                    style={[
                        styles.header,
                        keyboardVisible && styles.imageKeyboardVisible,
                    ]}
                />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                >
                    <ScrollView
                        contentContainerStyle={styles.flexWrapper}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.flexWrapper}>
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
                                        },
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
                                    <TouchableOpacity
                                        onPress={() => setSecure(!secure)}
                                    >
                                        <MaterialIcons
                                            name={
                                                secure
                                                    ? "visibility"
                                                    : "visibility-off"
                                            }
                                            size={20}
                                            color="#888"
                                        />
                                    </TouchableOpacity>
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
                                                checked &&
                                                    styles.checkboxChecked,
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
                                                {
                                                    color: checked
                                                        ? "#616161"
                                                        : "#9E9E9E",
                                                },
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

                                <View
                                    style={{
                                        height: height * 0.06,
                                        justifyContent: "center",
                                    }}
                                >
                                    {error && (
                                        <View style={styles.errorBox}>
                                            <MaterialIcons
                                                name="error-outline"
                                                size={20}
                                                color="#D32F2F"
                                            />
                                            <Text style={styles.errorText}>
                                                {error}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Pressable
                                    onPress={annonymus}
                                    style={styles.Button}
                                >
                                    <Text style={{ color: "white" }}>
                                        Annonimo
                                    </Text>
                                </Pressable>

                                <TouchableOpacity
                                    onPress={signIn}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>
                                        Iniciar sesión
                                    </Text>
                                </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push("/signup")}
                            >
                                <Text style={styles.register}>
                                    ¿No tienes una cuenta?{" "}
                                    <Text style={styles.registerLink}>
                                        Registrarse
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                            <Pressable onPress={Anonimus} style={styles.anonimus}>
                                <Text style={styles.register}>Anonimus</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    anonimus:{
        paddingBlock:4,
        paddingInline:8,
        backgroundColor:"#0062ff"
    },
    header: {
        width: "100%",
        height: height * 0.55,
        resizeMode: "cover",
        position: "absolute",
        top: -height * 0.18,
        left: 0,
    },
    form: {
        flex: 1,
        justifyContent: "center", // o "flex-end", según tu diseño
        marginTop: height * 0.35,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: width * 0.05,
        zIndex: 10,
        paddingBottom: height * 0.05,
    },
    title: {
        fontSize: width * 0.09,
        fontWeight: "bold",
        marginBottom: height * 0.03,
        color: "#424242",
    },
    label: {
        fontSize: width * 0.04,
        marginTop: height * 0.01,
        marginBottom: height * 0.005,
        color: "#616161",
        fontWeight: "bold",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        paddingBottom: height * 0.005,
    },
    input: {
        flex: 1,
        marginLeft: width * 0.02,
        paddingVertical: height * 0.01,
        color: "#616161",
        fontWeight: "bold",
    },
    options: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: height * 0.02,
        marginBottom: height * 0.1,
    },
    forgot: {
        color: "#397EE6",
        fontSize: width * 0.035,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#397EE6",
        padding: height * 0.018,
        borderRadius: 10,
        alignItems: "center",
        marginTop: height * 0.01,
    },
    buttonText: {
        color: "#fff",
        fontSize: width * 0.04,
        fontWeight: "bold",
    },
    register: {
        textAlign: "center",
        color: "#616161",
        marginTop: height * 0.02,
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
        marginLeft: width * 0.015,
        fontWeight: "bold",
    },
    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FDECEA",
        borderWidth: 1,
        borderColor: "#F5C6CB",
        padding: width * 0.025,
        borderRadius: 8,
        marginBottom: height * 0.01,
        marginTop: -10,
        gap: 10,
    },
    errorText: {
        color: "#D32F2F",
        fontWeight: "bold",
        fontSize: width * 0.035,
        flexShrink: 1,
    },
    checkboxChecked: {
        backgroundColor: "#397EE6",
        borderColor: "#397EE6",
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        width: width * 0.045,
        height: width * 0.045,
        resizeMode: "contain",
        tintColor: "#888",
        marginRight: width * 0.01,
    },
    flexWrapper: {
        flex: 1,
        justifyContent: "flex-end",
    },
    imageKeyboardVisible: {
        top: -width * 0.8,
    },
    Button: {
        paddingBlock: 10,
        paddingInline: 20,
        backgroundColor: "blue",
        borderRadius: 10,
        marginTop: 12,
    },
});
