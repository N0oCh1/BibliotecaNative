import { obtenerPrestamosDelUsuario } from "@/api/prestarLibro";
import { CurrentUser } from "@/utils/hooks/useAuthentication";
import { View, Text, Button } from "react-native";

export default function PrestamosScreen(){

  const handleTestPrestamos = async() => {
    const authData = await CurrentUser();
    const data = await obtenerPrestamosDelUsuario(authData.localId);
    console.log(data);
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Prestamos Screen</Text>
      <Button title="Ver mis préstamos" onPress={() => {handleTestPrestamos()}} />
    </View>
  );
}