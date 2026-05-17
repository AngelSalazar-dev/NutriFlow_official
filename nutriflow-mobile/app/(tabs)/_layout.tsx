import { Tabs } from 'expo-router';
import React from 'react';
import { LayoutDashboard, Utensils, BookOpen } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#10b981',   // Verde de acento
        tabBarInactiveTintColor: '#737373', // Gris de apagado
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#171717',       // Fondo de tarjeta oscuro
          borderTopColor: '#262626',        // Borde fino
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size || 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="food-log"
        options={{
          title: 'Comidas',
          tabBarIcon: ({ color, size }) => <Utensils size={size || 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recetas',
          tabBarIcon: ({ color, size }) => <BookOpen size={size || 24} color={color} />,
        }}
      />
    </Tabs>
  );
}
