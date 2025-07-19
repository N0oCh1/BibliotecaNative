import { Stack } from "expo-router";
import React, { useState} from "react";
import SplashScreen from "./splashScreen";


export default function RootLayout() {
const [isAppReady, setIsAppReady] = useState(false);

  
  if (!isAppReady) {
    return (
        <SplashScreen
            onFinish={(isCancelled) => !isCancelled && setIsAppReady(true)}
        />
    );
      
  }

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
        name="bibliotecaLibro/[libro]"
      />
      <Stack.Screen
        name="bibliotecaAmigo/[id]"
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
