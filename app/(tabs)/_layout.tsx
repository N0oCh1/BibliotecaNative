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
          headerStyle: {
            height: 55,
          },
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          headerStyle: {
            height: 55,
          },
          headerShown:true,
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="search" color={color} />,
        }}
      />
       <Tabs.Screen
        name="crear"
        options={{
          title: 'Añadir',
                    headerStyle: {
            height: 55,
          },
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="upload" color={color} />,
        }}
      />
    </Tabs>
  );
}