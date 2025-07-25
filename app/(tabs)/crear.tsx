import React, {  useState } from "react";
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
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker"; 
import { yupResolver } from "@hookform/resolvers/yup";
import { db } from "@/firebase";
import * as yup from "yup";
import { grantPermission } from "@/utils/hooks/usePermission";
import { librosBiblioteca } from "@/utils/types";
import { addLibro } from "@/api/biblioteca";
import { SafeAreaView } from "react-native-safe-area-context";

const validacion = yup.object().shape({
  title: yup.string().required("Titulo requerido"),
  autor: yup.string().required("Autor requerido"),
  descripcion: yup.string().min(10, "Mínimo 10 caracteres"),
  formato: yup.string().required("Formato requerido"),
  categoria: yup.string().required("Categoría requerida"),
});

export default function createBook() {
  //uri de la imagen pickeada
  const [imagen, setImagen] = useState<ImagePicker.ImagePickerAsset |null>();
  // estado de carga
  const [carga, setCarga] = useState(false);
  // Estados para manejar el focus de los inputs
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  //validacion Yup
  const[open, setOpen] = useState<boolean>(false)
  const[items, setItems] = useState<any>([
    {label: 'Seleccione el formato', value:null},
    {label: 'Fisico', value:"fisico"},
    {label: 'Digital', value:"digital"}
  ])
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacion),
  });

  //image picker
  const pickearImagen = async () => {
    try{
      await grantPermission()
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });
      if(result.canceled){
        alert('No selecciono ninguna imagen')
        return
      }
      alert('Imagen seleccionada')
      setImagen(result.assets ? result.assets[0]:null)
    }
    catch(e){
      alert('Error al seleccionar imagen')
      console.log(e);
    }
  };

  const formSubmit = async (data: any) => {
    try {
      setCarga(true);      
     const bookData:librosBiblioteca = {
      titulo: data.title,
      autor: data.autor,
      descripcion: data.descripcion,
      categoria:data.categoria,
      formato:data.formato,
      imagen: imagen?.uri
     }
     
    await addLibro(bookData)
    setImagen(null)
    reset();
      alert("libro agregado con exitosamente");
    } catch (error) {
      console.log("Error al agregar libro:", error);
      alert("Error al agregar libro");
    } finally {
      setCarga(false);
    }
  };

  // Función para obtener el estilo del input según el estado
  const getInputStyle = (fieldName: string) => {
    return [
      styles.input,
      focusedInput === fieldName && styles.inputFocused
    ];
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: "#f0f8ff" }}>
        <View style={styles.barraSuperior}>
        <Text style={styles.barraTexto}>Añadir</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Rellena los siguientes campos para añadir un nuevo tesoro a la comunidad.</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.fieldLabel}>Título del libro</Text>
              <TextInput
                placeholder="Ejemplo: El Señor de los Anillos"
                style={getInputStyle('title')}
                onChangeText={onChange}
                value={value}
                onFocus={() => setFocusedInput('title')}
                onBlur={() => setFocusedInput(null)}
              />
              {errors.title && (
                <Text style={styles.error}>{errors.title.message}</Text>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="autor"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.fieldLabel}>Autor</Text>
              <TextInput
                placeholder="Ejemplo: J.R.R. Tolkien"
                style={getInputStyle('autor')}
                onChangeText={onChange}
                value={value}
                onFocus={() => setFocusedInput('autor')}
                onBlur={() => setFocusedInput(null)}
              />
              {errors.autor && (
                <Text style={styles.error}>{errors.autor.message}</Text>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="descripcion"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.fieldLabel}>Descripción</Text>
              <TextInput
                placeholder="Una breve descripción del libro"
                style={[getInputStyle('descripcion'), { height: 100 }]}
                multiline
                onChangeText={onChange}
                value={value}
                onFocus={() => setFocusedInput('descripcion')}
                onBlur={() => setFocusedInput(null)}
              />
              {errors.descripcion && (
                <Text style={styles.error}>{errors.descripcion.message}</Text>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="categoria"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.fieldLabel}>Categoría</Text>
              <TextInput
                placeholder="Ejemplo: Fantasía, Ciencia Ficción, Romance"
                style={getInputStyle('categoria')}
                onChangeText={onChange}
                value={value}
                onFocus={() => setFocusedInput('categoria')}
                onBlur={() => setFocusedInput(null)}
              />
              {errors.categoria && (
                <Text style={styles.error}>{errors.categoria.message}</Text>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="formato"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.fieldLabel}>Formato</Text>
              <DropDownPicker
              open={open}
              value={value}
              items={items}
              setItems={setItems}
              onChangeValue={onChange}
              setOpen={setOpen}
              setValue={onChange}
              placeholder="Selecciona el formato del libro"
              listMode="SCROLLVIEW"
              style={[styles.input, open && styles.inputFocused]}
              />
              {errors.formato && (
                <Text style={styles.error}>{errors.formato.message}</Text>
              )}
            </>
          )}
        />
        
        {/* Sección de imagen */}
        <Text style={styles.fieldLabel}>Imagen del libro</Text>
        {imagen && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imagen.uri }} style={styles.image} />
          </View>
        )}
        
        {/* Botones personalizados */}
        <TouchableOpacity style={styles.customButton} onPress={pickearImagen}>
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        
        <View style={styles.buttonSeparator} />
        
        {carga ? (
          <ActivityIndicator size="large" color="#0077b6" style={styles.buttonSeparator} />
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit(formSubmit)}>
            <Text style={styles.primaryButtonText}>Agregar Libro</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f0f8ff",
  },
  barraSuperior: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
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
  barraTexto:{
    color: "#0056b3",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#0056b3",
    fontWeight: "bold",
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#c9d0eaff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputFocused: {
    borderColor: "#0077b6",
    borderWidth: 2,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
    width: 180,
    height: 240,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  customButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#0077b6",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#0077b6",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#0077b6",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSeparator: {
    marginVertical: 10,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0056b3",
    marginBottom: 6,
    marginTop: 5,
  },
  buttom:{
    margin: 5
  }
});