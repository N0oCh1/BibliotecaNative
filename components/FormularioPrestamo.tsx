import { enviarSolicitud } from "@/api/prestarLibro";
import { librosBiblioteca } from "@/utils/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Picker } from "@react-native-picker/picker";
import React, { SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Modal, TextInput, View, StyleSheet, Text } from "react-native";
import * as yup from "yup";


interface FormularioPrestamoProps {
  detalleLibro: {idLibro:string, idOwner:string, titulo:string};
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
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacion),
  });

  const solicitar = async(data:any) => {
    try {
      const datosFormulario = {
        ubicacion: data.ubicacion,
        mensaje: data.mensaje,
        tiempo: data.tiempo,
      };
      await enviarSolicitud(detalleLibro.idLibro, detalleLibro.idOwner, datosFormulario);
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
                {errors.tiempo && <Text style={{ color: "red" }}>{errors.tiempo.message}</Text>}
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={style.input}
                >
                  <Picker.Item label="Selecciona tiempo de préstamo" value="" />
                  <Picker.Item label="3 días" value="3" />
                  <Picker.Item label="7 días" value="7" />
                  <Picker.Item label="14 días" value="14" />
                  <Picker.Item label="30 días" value="30" />
                </Picker>
              </View>
            )}
          />
          <Controller
            control={control}
            name="ubicacion"
            render={({ field: { onChange, value } }) => (
              <>
                {errors.ubicacion && <Text style={{ color: "red" }}>{errors.ubicacion.message}</Text>}
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
                {errors.mensaje && <Text style={{ color: "red" }}>{errors.mensaje.message}</Text>}
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
            <Button
              title="Enviar"
              onPress={handleSubmit(solicitar)}
            />
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
