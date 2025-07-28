import React, {  use, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller, set } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker"; 
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { grantPermission } from "@/utils/hooks/usePermission";
import { librosBiblioteca } from "@/utils/types";
import { addLibro } from "@/api/biblioteca";
import { SafeAreaView } from "react-native-safe-area-context";
import Boton from "@/components/Boton";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Alerta from "@/components/Alerta";

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
  const [cargaImagen, setCargaImagen] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacion),
  });

  const[alerta, setAlerta] = useState<boolean>(false)
  const[variante, setVariante] = useState<"Informante" | "Exitoso" | "Advertencia">("Informante")
  const[mensaje, setMensaje] = useState<string>("")


  //image picker
  const pickearImagen = async () => {
    try{
      setCargaImagen(true)
      await grantPermission()
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });
      if(result.canceled){
        setMensaje('No selecciono ninguna imagen')
        setVariante('Informante')
        setAlerta(true)

        setCargaImagen(false)
        return
      }
      setMensaje('Imagen seleccionada')
      setVariante('Exitoso')
      setAlerta(true)
      setImagen(result.assets ? result.assets[0]:null)
      setCargaImagen(false)
    }
    catch(e){
      setCargaImagen(false)
      setMensaje('Error al seleccionar imagen')
      setVariante('Advertencia')
      setAlerta(true)
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
      setVariante("Exitoso")
      setMensaje("Libro agregado exitosamente 🎊");
      setAlerta(true);
    } catch (error) {
      console.log("Error al agregar libro:", error);
      setVariante("Advertencia")
      setMensaje("Error al agregar libro");
      setAlerta(true);
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
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: "#ffffff", position:"relative" }}>
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
        <View style={{flexDirection:"column", gap:30}}>
          {/* Botones personalizados */}
          <Boton
            titulo="Seleccionar Imagen"
            onPress={pickearImagen}
            variante="Secundario"
            loading={cargaImagen}
            icon={<Entypo name="image" size={24} color="#0077b6" />}
          />
          <Boton
            titulo="Subir Imagen"
            onPress={handleSubmit(formSubmit)}
            variante="Primario"
            loading={carga}
            icon={<FontAwesome name="pencil-square-o" size={24} color="#fff" />}
          />
        </View>
      </ScrollView>

      <Alerta
        visible={alerta}
        variante={variante}
        mensaje={mensaje}
        onHide={() => setAlerta(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#E8EBF7",
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