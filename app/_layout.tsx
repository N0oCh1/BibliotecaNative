import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* esto es lo que dice que pantalla inicia */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Hide the header for the tabs layout
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false, // Hide the header for the tabs layout
        }}
      />
    </Stack>
  )
}
