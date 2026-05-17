import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Leaf, User, Mail, Lock, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    sex: 'male',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    goal: 'maintain',
  });

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Por favor llena los datos básicos');
        return;
      }
    }
    setError('');
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setError('');
    setStep((s) => s - 1);
  };

  const handleRegister = async () => {
    if (!formData.age || !formData.weight || !formData.height) {
      setError('Por favor completa todos tus datos corporales');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await register({
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
      });
    } catch (err: any) {
      setError(err.message || 'Error al crear cuenta');
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-8 justify-center">
          <View className="flex-row items-center justify-between mb-8">
            {step > 1 ? (
              <TouchableOpacity onPress={prevStep} className="p-2 rounded-xl bg-card border border-border">
                <ChevronLeft size={20} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <View className="w-10" />
            )}
            <Text className="text-sm font-bold text-muted-foreground">Paso {step} de 3</Text>
            <TouchableOpacity onPress={() => router.replace('/login')} className="p-2">
              <Text className="text-primary font-bold text-sm">Cancelar</Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <View className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 mb-6">
              <Text className="text-red-400 text-sm text-center font-medium">{error}</Text>
            </View>
          ) : null}

          {step === 1 && (
            <View className="flex-1 justify-center space-y-6">
              <View className="items-center mb-6">
                <View className="p-3 rounded-full bg-emerald-900/30 mb-4 border border-emerald-500/20">
                  <User size={32} color="#10b981" />
                </View>
                <Text className="text-3xl font-extrabold text-white tracking-tighter text-center">
                  Crear Cuenta
                </Text>
                <Text className="text-sm text-muted-foreground mt-1 text-center">
                  Comienza tu viaje hacia una vida saludable
                </Text>
              </View>

              <View className="space-y-4">
                <View className="space-y-2 mb-4">
                  <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">Nombre</Text>
                  <View className="flex-row items-center bg-card rounded-2xl border border-border px-4 py-3">
                    <User size={20} color="#737373" />
                    <TextInput
                      value={formData.name}
                      onChangeText={(v) => setFormData({ ...formData, name: v })}
                      placeholder="Tu nombre"
                      placeholderTextColor="#737373"
                      className="flex-1 text-white text-base h-10 ml-3"
                    />
                  </View>
                </View>

                <View className="space-y-2 mb-4">
                  <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">Correo</Text>
                  <View className="flex-row items-center bg-card rounded-2xl border border-border px-4 py-3">
                    <Mail size={20} color="#737373" />
                    <TextInput
                      value={formData.email}
                      onChangeText={(v) => setFormData({ ...formData, email: v })}
                      placeholder="correo@ejemplo.com"
                      placeholderTextColor="#737373"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      className="flex-1 text-white text-base h-10 ml-3"
                    />
                  </View>
                </View>

                <View className="space-y-2 mb-6">
                  <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">Contraseña</Text>
                  <View className="flex-row items-center bg-card rounded-2xl border border-border px-4 py-3">
                    <Lock size={20} color="#737373" />
                    <TextInput
                      value={formData.password}
                      onChangeText={(v) => setFormData({ ...formData, password: v })}
                      placeholder="Mínimo 8 caracteres"
                      placeholderTextColor="#737373"
                      secureTextEntry
                      className="flex-1 text-white text-base h-10 ml-3"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={nextStep}
                  activeOpacity={0.8}
                  className="w-full bg-primary py-4 rounded-2xl flex-row justify-center items-center"
                >
                  <Text className="text-white font-bold text-lg mr-2">Siguiente</Text>
                  <ChevronRight size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="flex-1 justify-center space-y-6">
              <View className="items-center mb-6">
                <Text className="text-3xl font-extrabold text-white tracking-tighter text-center">
                  Datos Corporales
                </Text>
                <Text className="text-sm text-muted-foreground mt-1 text-center">
                  Nos ayuda a calcular tus metas exactas
                </Text>
              </View>

              <View className="space-y-4">
                <View className="flex-row justify-between mb-4">
                  <View className="w-[48%] space-y-2">
                    <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">Edad</Text>
                    <View className="bg-card rounded-2xl border border-border px-4 py-3">
                      <TextInput
                        value={formData.age}
                        onChangeText={(v) => setFormData({ ...formData, age: v })}
                        placeholder="25"
                        placeholderTextColor="#737373"
                        keyboardType="number-pad"
                        className="text-white text-base h-10"
                      />
                    </View>
                  </View>

                  <View className="w-[48%] space-y-2">
                    <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">Sexo</Text>
                    <View className="flex-row bg-card rounded-2xl border border-border p-1 h-[56px] items-center">
                      <TouchableOpacity
                        onPress={() => setFormData({ ...formData, sex: 'male' })}
                        className={`flex-1 items-center justify-center py-2 rounded-xl ${formData.sex === 'male' ? 'bg-primary' : ''}`}
                      >
                        <Text className={`font-bold text-sm ${formData.sex === 'male' ? 'text-white' : 'text-muted-foreground'}`}>H</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setFormData({ ...formData, sex: 'female' })}
                        className={`flex-1 items-center justify-center py-2 rounded-xl ${formData.sex === 'female' ? 'bg-primary' : ''}`}
                      >
                        <Text className={`font-bold text-sm ${formData.sex === 'female' ? 'text-white' : 'text-muted-foreground'}`}>M</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View className="flex-row justify-between mb-6">
                  <View className="w-[48%] space-y-2">
                    <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">Peso (kg)</Text>
                    <View className="bg-card rounded-2xl border border-border px-4 py-3">
                      <TextInput
                        value={formData.weight}
                        onChangeText={(v) => setFormData({ ...formData, weight: v })}
                        placeholder="70"
                        placeholderTextColor="#737373"
                        keyboardType="numeric"
                        className="text-white text-base h-10"
                      />
                    </View>
                  </View>

                  <View className="w-[48%] space-y-2">
                    <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">Altura (cm)</Text>
                    <View className="bg-card rounded-2xl border border-border px-4 py-3">
                      <TextInput
                        value={formData.height}
                        onChangeText={(v) => setFormData({ ...formData, height: v })}
                        placeholder="175"
                        placeholderTextColor="#737373"
                        keyboardType="numeric"
                        className="text-white text-base h-10"
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={nextStep}
                  activeOpacity={0.8}
                  className="w-full bg-primary py-4 rounded-2xl flex-row justify-center items-center"
                >
                  <Text className="text-white font-bold text-lg mr-2">Siguiente</Text>
                  <ChevronRight size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 3 && (
            <View className="flex-1 justify-center space-y-6">
              <View className="items-center mb-6">
                <Text className="text-3xl font-extrabold text-white tracking-tighter text-center">
                  Objetivo y Actividad
                </Text>
                <Text className="text-sm text-muted-foreground mt-1 text-center">
                  Ajustes finales para afinar tu plan
                </Text>
              </View>

              <View className="space-y-6">
                <View className="space-y-3">
                  <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">Tu Objetivo Principal</Text>
                  {['lose', 'maintain', 'gain'].map((goalOption) => (
                    <TouchableOpacity
                      key={goalOption}
                      onPress={() => setFormData({ ...formData, goal: goalOption })}
                      className={`w-full py-4 px-6 rounded-2xl border ${formData.goal === goalOption ? 'bg-primary/20 border-primary' : 'bg-card border-border'}`}
                    >
                      <Text className="text-white font-bold text-base capitalize">
                        {goalOption === 'lose' ? '🏃 Perder Peso' : goalOption === 'maintain' ? '⚖️ Mantener Peso' : '💪 Ganar Masa Muscular'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View className="space-y-3 mb-6">
                  <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">Nivel de Actividad</Text>
                  <View className="flex-row flex-wrap justify-between">
                    {[
                      { value: 'sedentary', label: 'Sedentario' },
                      { value: 'light', label: 'Ligero' },
                      { value: 'moderate', label: 'Moderado' },
                      { value: 'active', label: 'Activo' },
                    ].map((actOption) => (
                      <TouchableOpacity
                        key={actOption.value}
                        onPress={() => setFormData({ ...formData, activityLevel: actOption.value })}
                        className={`w-[48%] py-3 rounded-2xl border items-center mb-3 ${formData.activityLevel === actOption.value ? 'bg-primary/20 border-primary' : 'bg-card border-border'}`}
                      >
                        <Text className="text-white font-bold text-sm">{actOption.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  className="w-full bg-primary py-4 rounded-2xl flex-row justify-center items-center"
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Text className="text-white font-bold text-lg mr-2">Crear Cuenta</Text>
                      <Leaf size={20} color="#FFFFFF" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
