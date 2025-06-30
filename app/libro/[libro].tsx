import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function LibroDetalle() {
  const navigation = useNavigation()
  const {libro, link} = useLocalSearchParams()
  console.log(libro, link)

  useEffect(() => {
    if (libro) {
      navigation.setOptions({ title: String(libro) });
    }
  }, [libro, navigation]);
  
  return(
    <View>
      <Text>
        Este es detalle de libros
      </Text>
    </View>
  )
}