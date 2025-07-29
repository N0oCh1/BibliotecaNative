import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View, StyleSheet, PressableStateCallbackType } from "react-native";

interface BotonProp2 {
  loading?: boolean;
  icon?: ReactNode;
  onPress: () => void;
}

const LogoutBtn: React.FC<BotonProp2> = ({  onPress, icon, loading = false }) => {
  let primario: string = ""; // bordes
  let secundario: string = "#grey"; // fondo

  

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
});

export default LogoutBtn;