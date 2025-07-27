import { Image } from "expo-image";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CartaSolicitudProps{
  titulo_libro:string;
  imagen:string;
  quien?:string;
  mensaje:string;
  tiempo?:string | null
  estadoSolicitud?:string;
  estado?: string
  dueno?:string
  ubicacion?:string
}

const CartaSolicitud : React.FC<CartaSolicitudProps> = ({
  titulo_libro, quien, mensaje, tiempo, imagen, estadoSolicitud, estado,dueno, ubicacion
}) =>{
  return(
    <View style={style.carta}>
      <Image
        source={{ uri: imagen }}
        contentFit="cover"
        style={{ height:150, width:100 , borderRadius:8}}
      />
      <View style={{flexDirection:"column", justifyContent:"space-between", padding:12}}>
        <Text style={style.titulo}>Titulo: {titulo_libro}</Text>
        {quien ? <Text  style={style.texto}>Quien lo solicito: {quien}</Text> : null}
        {dueno ? <Text  style={style.texto}>Dueño: {dueno}</Text> : null}
        {estado ? <Text  style={style.texto}>Estado: {estado}</Text> : null}
        {ubicacion ? <Text  style={style.texto}>Dirrecion: {ubicacion}</Text> : null}
        <Text style={style.texto}>Mensaje: {mensaje}</Text>
        {estadoSolicitud ? <Text  style={style.texto}>Estado de solicitud: {estadoSolicitud}</Text> : null}
        {tiempo ? <Text  style={style.tiempo}>{tiempo}</Text> : null}
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  carta:{
    flexDirection:"row",
    gap:12
  },
  texto:{
    fontSize:14
  },
  titulo:{
    color:"#0056b3",
    fontSize:16,
    fontWeight:"bold"
  },
  tiempo:{
    fontSize:16,
    fontWeight:"bold"
  }
})

export default CartaSolicitud;