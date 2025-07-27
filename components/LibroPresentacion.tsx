import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, View, StyleSheet, Text, ActivityIndicator } from "react-native";

interface LibroPresentacionProps {
  imagen: string;
  titulo: string;
  autor: string;
  onPress: () => void;
}

const LibroPresentacion: React.FC<LibroPresentacionProps> = ({
  imagen,
  titulo,
  autor,
  onPress,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Pressable onPress={onPress} style={style.libro}>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading && (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{ position: "absolute", zIndex: 1 }}
          />
        )}
        <Image
          source={{ uri: imagen }}
          style={style.image}
          contentFit="contain"
          onLoadStart={()=>setLoading(true)}
          onLoadEnd={()=>setLoading(false)}
        />
        <View style={style.descripcionLibro}>
          <Text style={style.title}>{titulo}</Text>
          <Text style={style.author}>{autor || "Sin autor"}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const style = StyleSheet.create({
  libro: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    padding:20,
    backgroundColor: "#fff",
    marginBottom: "3%",
    // Sombra sutil para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    // Sombra sutil para Android
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
    borderRadius: 4,
  },
  descripcionLibro: {
    marginTop: "5%",
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color:"#0056b3"
  },
  author: {
    marginTop: 5, // Espacio entre título y autor
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
});

export default LibroPresentacion;
