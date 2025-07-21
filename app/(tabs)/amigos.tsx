import { Controller, useForm } from "react-hook-form";
import { View, Text, TextInput, Pressable, ScrollView, Button } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet } from "react-native";
import { useState } from "react";
import { CurrentUser } from "@/utils/hooks/useAuthentication";
import { useFocusEffect, useRouter } from "expo-router";
import { buscarAmigo, insertarAmigo, obtenerMisAmigos } from "@/api/amigos";
import { Amigos } from "@/utils/types";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AmigosScreen() {
  const route = useRouter();

  const { control, handleSubmit, reset } = useForm();
  const [userId, setUserId] = useState<string>();
  const [detalleAmigos, setDetalleAmigos] = useState<Amigos[]|undefined>();

  // Obtenmer id del usuario para compartir con amigos
  useFocusEffect(()=>{
    const obtenerUsuario = async () => {
      const authData = await CurrentUser();
      try{
        setDetalleAmigos(await obtenerMisAmigos());
        setUserId(authData.localId);
      }catch(err){
        alert(err);
      }
    };
    obtenerUsuario();
  })
  
  // Buscar amigo para agregar a amigos
  const onSubmit = async (data: any) => {
    try{
      const amigos = await buscarAmigo(data.search);
      if (amigos && amigos.length > 0) {
        await insertarAmigo(amigos[0]); 
      } 
    }   
    catch(err:unknown){
      alert((err as Error).message);
    }
    reset();
  };
  const verBiblioteca = (id: string, username:string) => {
    route.push({ pathname: `/bibliotecaAmigo/${id}`, params: { username } });
  }
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.barraSuperior}>
        <Text style={styles.barraTexto}>Amigos</Text>
      </View>
      <View style={styles.container}>
        <Text>user id del usuario logiado: {userId}</Text>
        <View style={styles.searchContainer}>
          <Controller
            control={control}
            name="search"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="ingresa el ID del amigo"
                inputMode="search"
                onChangeText={onChange}
                value={value}
                style={styles.input}
              />
            )}
          />
          <Pressable onPress={handleSubmit(onSubmit)} style={styles.button}>
            <Text style={styles.buttonText}><AntDesign name="search1" size={24} color="white" /></Text>
          </Pressable>
        </View>
        <ScrollView>
          {detalleAmigos && detalleAmigos.length > 0 ? (
            detalleAmigos.map((amigo, index) => (
              <View key={index} style={{ padding: 10 }}>
                <Text>{amigo.nombre}</Text>
                <Button
                  title="Ver Biblioteca"
                  onPress={() => {
                    verBiblioteca(amigo.id, amigo.nombre);
                  }}
                />
              </View>
            ))
          ) : (
            <Text style={{ padding: 10 }}>No tienes amigos agregados.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  input: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    borderWidth: 2,
    borderColor: "#ccc",
    padding: 10,
  },
  button: {
    backgroundColor: "#007bff",
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
    barraTexto:{
    color: "#0056b3",
    fontSize: 18,
    fontWeight: "bold",
  }
});
