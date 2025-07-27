import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View, StyleSheet, PressableStateCallbackType } from "react-native";

interface BotonProp {
  titulo: string;
  variante: "Primario" | "Secundario" | "Terciario" | "Cuaternario" | "Nada";
  loading?: boolean;
  icon?: ReactNode;
  onPress: () => void;
}

const Boton: React.FC<BotonProp> = ({ titulo, variante, onPress, icon, loading = false }) => {
  let primario: string = ""; // bordes
  let secundario: string = ""; // fondo
  let terciario: string = ""; // letras

  if (variante === "Primario") {
    primario = "#0077b6";
    secundario = "#0077b6";
    terciario = "#ffffff";
  }
  if (variante === "Secundario") {
    primario = "#0077b6";
    secundario = "#ffffff";
    terciario = "#0077b6";
  }
  if (variante === "Terciario") {
    primario = "#b40000ff";
    secundario = "#b40000ff";
    terciario = "#ffffff";
  }
  if (variante === "Cuaternario") {
    primario = "#008b00ff";
    secundario = "#008b00ff";
    terciario = "#ffffff";
  }
  if (variante === "Nada") {
    primario = "#00000000";
    secundario = "#00000000";
    terciario = "#0077b6";
  }

  return (
    <View style={{ height: 45, margin: 5 }}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={primario}
          style={{ zIndex: 1, alignSelf: "center" }}
        />
      ) : (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            style.boton,
            {
              backgroundColor: pressed
                ? `${secundario}cc` // aplica opacidad al presionar
                : secundario,
              borderColor: primario,
              transform: [{ scale: pressed ? 0.98:1 }] , // efecto de "hundido"
            },
          ]}
        >
          {icon || null}
          <Text style={[style.text, { color: terciario }]}>{titulo}</Text>
        </Pressable>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  boton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Boton;