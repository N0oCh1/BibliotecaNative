import React from "react";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { Pressable, Text, View,StyleSheet } from "react-native";
import { useState } from "react";
import { app } from "@/firebase";
import { removeCredencial } from "@/utils/hooks/useCredential";
import { CurrentUser, removeCurrentUser } from "@/utils/hooks/useAuthentication";

export default function HomeScreen() {
  const db = getFirestore(app)
  const [usuario, setUsuario] = useState<string>()
  const [pressed, setPressed] = useState<boolean>(false)
  const route = useRouter();
  const auth = CurrentUser();
  const guardarAlgo = async() =>{
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Alan",
        middle: "Mathison",
        last: "Turing",
        born: 1912
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  const obenerAlgo = async() =>{
    try{
      const response = await getDocs(collection(db, "users"))
      response.forEach(item=>console.log(item.id, item.data()))
    } catch(e){
      console.error(e);
    }
  }
  const cerrarSesion = async() =>{ 
    setPressed(false); 
    await removeCredencial()
    await removeCurrentUser()
    route.push("/login")
  }
  
  useFocusEffect(()=>{
    const getUsuario  = async () =>{
      if (auth) {
        const user = await getDoc(doc(db, "usuarios", (await auth).localId));
        setUsuario(user.data()?.usuario)
      } else {
        console.warn("No user is currently logged in.");
      }
    }
    getUsuario()
  })
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {usuario && 
        <Text style={{fontSize:20, fontWeight:"bold"}}>Bienvenido: {usuario}</Text>
      }
        <Pressable 
          style={[style.Button, {backgroundColor: pressed ? "white" : "blue"}]}
          onPressIn={() => setPressed(true)}
          onPressOut={() => cerrarSesion()}  
        > 
          <Text style={{color: pressed?"blue": "#ffffff"}}>LogOut</Text>
        </Pressable>

        <Pressable
          style={style.Button}
          onPress={guardarAlgo}
        >
          <Text style={{color:"white"}}>
            Prueba guardar algo
          </Text>
        </Pressable>

        <Pressable
          style={style.Button}
          onPress={obenerAlgo}
        >
          <Text style={{color:"white"}}>
            Prueba leer algo
          </Text>
        </Pressable>
      
    </View>
  );
}
const style = StyleSheet.create({
  Button:{
    paddingBlock:10,
    paddingInline:20,
    backgroundColor:"blue",
    borderRadius:10,
  }

});
