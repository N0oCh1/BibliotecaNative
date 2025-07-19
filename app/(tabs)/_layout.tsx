import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: 'blue',
      animation:'fade',
      tabBarVariant:"uikit",
      tabBarPosition:'bottom'
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown:false,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
        }}
      />
       <Tabs.Screen
        name="amigos"
        options={{
          title: 'Amigos',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          headerShown:false,
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="search" color={color} />,
        }}
      />
       <Tabs.Screen
        name="crear"
        options={{
          title: 'Añadir',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="upload" color={color} />,
        }}
      />
    </Tabs>
  );
}