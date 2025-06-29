import React from "react";
import { Link, useRouter } from "expo-router";
import { Pressable, Text, View,StyleSheet } from "react-native";
import { useState } from "react";

export default function Index() {
  const [pressed, setPressed] = useState<boolean>(false)
  const route = useRouter();
  
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
