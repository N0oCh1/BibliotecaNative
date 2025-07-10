import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { db } from "@/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import * as yup from "yup";

// Esquema de validación mejorado
const validacion = yup.object().shape({
  title: yup.string().trim().required("Título requerido"),
  autor: yup.string().trim().required("Autor requerido"),
  descripcion: yup
    .string()
    .trim()
    .min(10, "Mínimo 10 caracteres")
    .required("Descripción requerida"),
  categoria: yup.string().trim().required("Categoría requerida"),
});

export default function createBook() {
  const [imagen, setImagen] = useState<string | null>(null);
  const [carga, setCarga] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacion),
  });

  // Seleccionar imagen de galería
  const pickearImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
    });
    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  // Enviar formulario
  const formSubmit = async (data: any) => {
    if (!imagen) {
      Alert.alert("Falta imagen", "Por favor selecciona una imagen del libro.");
      return;
    }

    try {
      setCarga(true);

      const docRef = await addDoc(collection(db, "Libros"), {
        ...data,
        imagen, // Puedes guardar la URI de la imagen aquí o subirla luego
        createAt: Timestamp.now(),
        addedBy: "user-id-placeholder",
      });

      reset();
      setImagen(null);
      Alert.alert("Éxito", "Libro agregado exitosamente.");
    } catch (error) {
      console.log("Error al agregar libro:", error);
      Alert.alert("Error", "Ocurrió un error al agregar el libro.");
    } finally {
      setCarga(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Nuevo Libro</Text>

      {/* Campo: Título */}
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Título"
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
            {errors.title && (
              <Text style={styles.error}>{errors.title.message}</Text>
            )}
          </>
        )}
      />

      {/* Campo: Autor */}
      <Controller
        control={control}
        name="autor"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Autor"
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
            {errors.autor && (
              <Text style={styles.error}>{errors.autor.message}</Text>
            )}
          </>
        )}
      />

      {/* Campo: Descripción */}
      <Controller
        control={control}
        name="descripcion"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Descripción"
              style={[styles.input, { height: 100 }]}
              multiline
              onChangeText={onChange}
              value={value}
            />
            {errors.descripcion && (
              <Text style={styles.error}>{errors.descripcion.message}</Text>
            )}
          </>
        )}
      />

      {/* Campo: Categoría */}
      <Controller
        control={control}
        name="categoria"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Categoría"
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
            {errors.categoria && (
              <Text style={styles.error}>{errors.categoria.message}</Text>
            )}
          </>
        )}
      />

      {/* Imagen */}
      <Button title="Seleccionar Imagen" onPress={pickearImagen} />
      {imagen && <Image source={{ uri: imagen }} style={styles.image} />}

      {/* Botón de envío */}
      {carga ? (
        <ActivityIndicator size="large" color="#0077b6" />
      ) : (
        <Button title="Agregar Libro" onPress={handleSubmit(formSubmit)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#0077b6",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#0077b6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
});
