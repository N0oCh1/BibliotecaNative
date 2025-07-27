import React, { useEffect, useRef, useState } from "react";
import { ReactNode } from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface AlertaProp {
  visible: boolean;
  variante: "Informante" | "Exitoso" | "Advertencia";
  mensaje: string;
  onHide: () => void;
}


const Alerta: React.FC<AlertaProp>=({
  visible,
  variante,
  mensaje,
  onHide,
}) => {
  const opacidad = useRef(new Animated.Value(0)).current;
  let icon: ReactNode = <MaterialIcons name="info" size={24} color="#47B1F8" />;
  let borderColor:string = "#47B1F8";
  
  if(variante === "Informante"){
    icon = <MaterialIcons name="info" size={24} color="#47B1F8" />;
    borderColor = "#47B1F8"
  }
  if(variante === "Exitoso"){
    icon = <MaterialIcons name="check-circle-outline" size={24} color="#369e28" />
    borderColor = "#369e28"
  }
  if(variante === "Advertencia"){
    icon = <MaterialIcons name="warning" size={24} color="#f51f1f"/>
    borderColor="#f51f1f"
  }  

  useEffect(()=>{
    if(visible){
      Animated.timing(opacidad, {
        toValue: 1,
        duration:300,
        useNativeDriver:true
      }).start();

      const timeOut = setTimeout(()=>{
        Animated.timing(opacidad, {
          toValue: 0,
          duration:300,
          useNativeDriver:true
        }).start(()=>{
          onHide();
        })
      },3000)
      return()=>{
        clearTimeout(timeOut)
      }
    }
  },[visible])


  if(!visible){return null}
  return(
    <View style={[StyleSheet.absoluteFill]} pointerEvents="none">
      <Animated.View style={[styles.alerta,{opacity: opacidad , borderColor: borderColor}]}>
        {icon}
        <Text style={[styles.text, {color: borderColor}]}>{mensaje}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  alerta:{
    top:100,
    alignSelf:"center",
    justifyContent:"center",
    alignItems:"center",
    gap:20,
    borderWidth:2,
    backgroundColor:"#fff",
    paddingHorizontal:20,
    paddingVertical:12,
    borderRadius:8,
    flex:1,
    flexDirection:"row",
    position:"absolute"
  },
  text:{
    fontSize:16
  }
})

export default Alerta;