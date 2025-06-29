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
        name="busqueda"
        options={{
          title: 'Busqueda',
          headerShown:false,
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="search" color={color} />,
        }}
      />
    </Tabs>
  );
}