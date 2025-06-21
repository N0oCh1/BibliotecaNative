import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function Login() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Login Screen</Text>
      <Link href="(tabs)"><Text>Go to Home</Text></Link>
    </View>
  );
}
