import { View, Text, TextInput } from "react-native";

export default function AmigosScreen() {
  return (
    <View>
      <TextInput placeholder="Buscar amigos..." inputMode="search"/>
      <Text>Amigos</Text>
    </View>
  );
}
