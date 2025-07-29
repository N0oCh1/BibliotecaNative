import { enviarSolicitud } from "@/api/prestarLibro";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button, Modal, TextInput, View, StyleSheet, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as yup from "yup";
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import React, { useState, useEffect, SetStateAction } from "react";




interface FormularioPrestamoProps {
  detalleLibro: { idLibro: string; idOwner: string; titulo: string };
  modalVisible: boolean;
  setModalVisible: React.Dispatch<SetStateAction<boolean>>;
}

const validacion = yup.object().shape({
  ubicacion: yup.string().required("Ubicacion requerida"),
  mensaje: yup.string(),
  tiempo: yup.string().required("Tiempo requerido"),
});

const FormularioPrestamo = (props: FormularioPrestamoProps) => {
  const { detalleLibro, modalVisible, setModalVisible } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<any>([
    { label: "3 Dias", value: "3" },
    { label: "7 Dias", value: "7" },
    { label: "15 Dias", value: "15" },
    { label: "30 Dias", value: "30" },
  ]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacion),
  });

  
const [location, setLocation] = useState(null);
const [region, setRegion] = useState(null);

  const solicitar = async (data: any) => {
    try {
      const datosFormulario = {
        ubicacion: data.ubicacion,
        mensaje: data.mensaje,
        tiempo: data.tiempo,
      };
      await enviarSolicitud(
        detalleLibro.titulo,
        detalleLibro.idLibro,
        detalleLibro.idOwner,
        datosFormulario
      );
      alert("Solicitud enviada");
      reset();
      setModalVisible(false);
    } catch (erro) {
      alert(erro);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={style.modalContainer}>
        <View style={style.modalContent}>
          <Text style={style.modalTitle}>
            Solicitar: {detalleLibro?.titulo}
          </Text>

          <Controller
            control={control}
            name="tiempo"
            render={({ field: { onChange, value } }) => (
              <View>
                {errors.tiempo && (
                  <Text style={{ color: "red" }}>{errors.tiempo.message}</Text>
                )}
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setItems={setItems}
                  onChangeValue={onChange}
                  setOpen={setOpen}
                  setValue={onChange}
                  placeholder="selecciona el formato"
                  listMode="SCROLLVIEW"
                  style={style.input}
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name="ubicacion"
            render={({ field: { onChange, value } }) => (
              <>
                {errors.ubicacion && (
                  <Text style={{ color: "red" }}>
                    {errors.ubicacion.message}
                  </Text>
                )}
                <TextInput
                  placeholder="Ubicación de encuentro"
                  value={value}
                  onChangeText={onChange}
                  style={style.input}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="mensaje"
            render={({ field: { onChange, value } }) => (
              <>
                {errors.mensaje && (
                  <Text style={{ color: "red" }}>{errors.mensaje.message}</Text>
                )}
                <TextInput
                  placeholder="Mensaje opcional"
                  value={value}
                  onChangeText={onChange}
                  style={style.input}
                />
              </>
            )}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            <Button title="Enviar" onPress={handleSubmit(solicitar)} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
const style = StyleSheet.create({
  solicitarButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  solicitarText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.473)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
export { FormularioPrestamo };
