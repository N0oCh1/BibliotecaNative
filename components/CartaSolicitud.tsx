import { Image } from "expo-image";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CartaSolicitudProps{
  titulo_libro:string;
  imagen:string;
  quien:string;
  mensaje:string;
  tiempo?:string | null
  estadoSolicitud?:string;
  estado?: string
}

const CartaSolicitud : React.FC<CartaSolicitudProps> = ({
  titulo_libro, quien, mensaje, tiempo, imagen, estadoSolicitud, estado
}) =>{
  return(
    <View style={{flexDirection:"row"}}>
      <Image
        source={{ uri: imagen }}
        contentFit="cover"
        style={{ height:150, width:100 }}
      />
      <View style={{flexDirection:"column"}}>
        <Text>Titulo: {titulo_libro}</Text>
        <Text>Quien lo solicito: {quien}</Text>
        <Text>Mensaje: {mensaje}</Text>
        <Text>{estado ? `Estado: ${estado}` : null}</Text>
        <Text>{estadoSolicitud ? `Estado de solicitud: ${estadoSolicitud}` : null}</Text>
        <Text>{tiempo ? `Tiempo faltante: ${tiempo}` : null}</Text>
      </View>
    </View>
  )
}

const style = StyleSheet.create({

})

export default CartaSolicitud;