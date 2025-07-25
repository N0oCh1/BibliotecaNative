import { Stack } from "expo-router";
import React, { useState} from "react";
import SplashScreen from "./splashScreen";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { router } from "expo-router";

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url as string;
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (!isMounted || !response?.notification) {
          return;
        }
        redirect(response?.notification);
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}
export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  useNotificationObserver();
  if (!isAppReady) {
    return (
        <SplashScreen
            onFinish={(isCancelled:any) => !isCancelled && setIsAppReady(true)}
        />
    );
      
  }

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
        name="bibliotecaAmigo/libroAmigo/[libro]"
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
