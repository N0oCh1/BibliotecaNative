import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      {/* esto es lo que dice que pantalla inicia */}
      <Stack.Screen
        name="bienvenido"
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
        name="registro"
        options={{
          headerShown: false,
        }}
        />
      <Stack.Screen
        name="libro/[libro]"
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
