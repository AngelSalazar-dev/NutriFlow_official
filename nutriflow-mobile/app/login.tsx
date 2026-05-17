import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor llena todos los campos');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-12 justify-center">
          <View className="items-center mb-10">
            <View className="p-4 rounded-full bg-emerald-900/30 mb-4 border border-emerald-500/20">
              <Leaf size={48} color="#10b981" />
            </View>
            <Text className="text-4xl font-extrabold text-white tracking-tighter text-center">
              Nutri<Text className="text-primary">Flow</Text>
            </Text>
            <Text className="text-sm text-muted-foreground mt-2 text-center">
              Alcanza tus objetivos nutricionales con elegancia
            </Text>
          </View>

          <View className="space-y-4">
            {error ? (
              <View className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 mb-4">
                <Text className="text-red-400 text-sm text-center font-medium">{error}</Text>
              </View>
            ) : null}

            <View className="space-y-2 mb-4">
              <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">
                Correo Electrónico
              </Text>
              <View className="flex-row items-center bg-card rounded-2xl border border-border px-4 py-3">
                <Mail size={20} color="#737373" className="mr-3" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#737373"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="flex-1 text-white text-base h-10 ml-2"
                />
              </View>
            </View>

            <View className="space-y-2 mb-6">
              <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">
                Contraseña
              </Text>
              <View className="flex-row items-center bg-card rounded-2xl border border-border px-4 py-3">
                <Lock size={20} color="#737373" className="mr-3" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#737373"
                  secureTextEntry
                  className="flex-1 text-white text-base h-10 ml-2"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
              className="w-full bg-primary py-4 rounded-2xl shadow-lg flex-row justify-center items-center mb-6"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white font-bold text-lg">Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-muted-foreground text-sm">¿No tienes cuenta? </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-bold text-sm">Regístrate</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
