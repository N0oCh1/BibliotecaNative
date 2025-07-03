import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="info" color={color} />,
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