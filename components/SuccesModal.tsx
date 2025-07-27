import { Modal, Text, View, StyleSheet} from "react-native";
import React from "react";
import Boton from "./Boton";

interface ModalProps {
  aceptar: () => void;
  rechazar: () => void;
  visible: boolean;
  mensaje?: string;
}

const SuccesModal: React.FC<ModalProps> = ({
  aceptar,
  rechazar,
  visible,
  mensaje,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={rechazar}
      style={{position:"absolute",top:"50%",left:"50%", backgroundColor:"#0000006c"}}
    >
      <View style={style.container}>
        <View style={style.modal}>
        <Text style={{fontSize:20, fontWeight:"bold", textAlign:"center", color:"#0056b3"}}>Quieres continuar ?</Text>
        {mensaje ? <Text>{mensaje}</Text> : null}
        <View style={{flexDirection:"row"}}>
          <Boton titulo="Aceptar" variante="Primario" onPress={aceptar} />
          <Boton titulo="Rechazar" variante="Terciario" onPress={rechazar} />
        </View>
      </View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  container:{
    position:"absolute",
    width:"100%",
    height:"100%",
    flex:1,
    justifyContent:"center",
    zIndex:100,
    alignItems:"center",
    backgroundColor:"#0000006c"
  },
  modal:{
    padding:12,
    width:"80%",
    height:"30%",
    borderRadius:8,
    alignSelf:"center",
    justifyContent:"space-between",
    alignItems:"center",
    backgroundColor:"#ffff"
  }
})
export default SuccesModal;
