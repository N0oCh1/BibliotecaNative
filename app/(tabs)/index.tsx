import React from "react";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { Link, useRouter } from "expo-router";
import { Pressable, Text, View,StyleSheet } from "react-native";
import { useState } from "react";
import { app } from "@/firebase";

export default function Index() {
  const db = getFirestore(app)
  const [pressed, setPressed] = useState<boolean>(false)
  const route = useRouter();
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
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/about"><Text>Go to About</Text></Link>
        <Pressable 
          style={[style.Button, {backgroundColor: pressed ? "white" : "blue"}]}
          onPressIn={() => setPressed(true)}
          onPressOut={() => {setPressed(false); route.push("/login")}}  
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
