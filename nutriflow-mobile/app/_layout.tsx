import React, { useEffect } from 'react';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import '../global.css';

// Configuración de Tema Oscuro Premium NutriFlow
const NutriFlowTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0F0F0F',
    card: '#171717',
    text: '#FFFFFF',
    primary: '#10b981',
    border: '#262626',
  },
};

function InitialLayout() {
  const { isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inTabsGroup) {
      // Si no está autenticado e intenta entrar a las pestañas, redirigir a Login
      router.replace('/login');
    } else if (isAuthenticated && !inTabsGroup) {
      // Si ya está autenticado e intenta ir a Login/Registro, redirigir a Tabs
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={NutriFlowTheme}>
        <InitialLayout />
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  );
}
