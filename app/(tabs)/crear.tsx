import React, { use, useState } from "react";
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
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker"; 
import { yupResolver } from "@hookform/resolvers/yup";
import { db } from "@/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import * as yup from "yup";
import { getDocumentCondition, patchDocument, setDocument } from "@/api/useFirestore";
import { CurrentUser } from "@/utils/hooks/useAuthentication";
import { grantPermission } from "@/utils/hooks/usePermission";
import { librosBiblioteca } from "@/utils/types";
import { addLibro } from "@/api/biblioteca";

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
  //validacion Yup
  const[open, setOpen] = useState<boolean>(false)
  const[value, setValue] = useState<string>()
  const[items, setItems] = useState<any>([
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
     console.log("Firestore DB:", db);
     const bookData:librosBiblioteca = {
      titulo: data.title,
      autor: data.autor,
      descripcion: data.descripcion,
      categoria:data.categoria,
      formato:data.formato,
      imagen: imagen?.uri
     }
     
    await addLibro(bookData)
      reset();
      alert("libro agregado con exitosamente");
    } catch (error) {
      console.log("Error al agregar libro:", error);
      alert("Error al agregar libro");
    } finally {
      setCarga(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Nuevo Libro</Text>
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
      <Controller
        control={control}
        name="formato"
        render={({ field: { onChange, value } }) => (
          <>
            <DropDownPicker
            open={open}
            value={value}
            items={items}
            setItems={setItems}
            onChangeValue={onChange}
            setOpen={setOpen}
            setValue={onChange}
            placeholder="selecciona el formato"
            listMode="SCROLLVIEW"
            style={styles.input}
            />
            {errors.formato && (
              <Text style={styles.error}>{errors.formato.message}</Text>
            )}
          </>
        )}
      />
      {imagen && <Image source={{ uri: imagen.uri }} style={styles.image} />}
      <Button title="Seleccionar Imagen" onPress={pickearImagen} />
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
  buttom:{
    margin: 5
  }
});
