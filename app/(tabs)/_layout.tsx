import React from "react";
import { Tabs } from "expo-router";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";

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
          headerShown:true,
          headerTitleStyle:{
            color:"#0056b3"
          },
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
        name="prestamos"
        options={{
          title: 'Prestamos',
          headerShown:false,
          tabBarIcon: ({ color }) => <AntDesign size={24} name="find" color={color} />,
        }}
      />
       <Tabs.Screen
        name="crear"
        options={{
          title: 'Añadir',
          headerShown:false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="upload" color={color} />,
        }}
      />
    </Tabs>
  );
}