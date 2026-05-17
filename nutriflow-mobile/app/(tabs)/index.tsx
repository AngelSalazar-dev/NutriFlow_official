import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { CalorieDoughnut, MacroProgressBar } from '../../components/charts/MacroRing';
import { Flame, Droplets, LogOut, RefreshCw, Zap } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TodayStats {
  caloriesConsumed: number;
  caloriesBurned: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
}

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<TodayStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.get('/stats/today');
      if (res.data && res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.log('Error cargando estadísticas del dashboard:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
      </SafeAreaView>
    );
  }

  const calorieGoal = user?.calorieGoal || 2000;
  const consumed = stats?.caloriesConsumed || 0;
  
  // Mapear los porcentajes de macros igual que en la web
  const pTarget = Math.round((calorieGoal * 0.3) / 4);
  const cTarget = Math.round((calorieGoal * 0.45) / 4);
  const fTarget = Math.round((calorieGoal * 0.25) / 9);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
      >
        {/* Header Premium con saludo */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">
              ¡Hola de nuevo!
            </Text>
            <Text className="text-3xl font-black text-white tracking-tighter">
              {user?.name ? user.name.split(' ')[0] : 'Usuario'} 👋
            </Text>
          </View>
          <View className="flex-row space-x-2 gap-2">
            <TouchableOpacity
              onPress={onRefresh}
              className="p-3 bg-card border border-border rounded-2xl"
            >
              <RefreshCw size={18} color="#10b981" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logout}
              className="p-3 bg-card border border-border rounded-2xl"
            >
              <LogOut size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tarjeta de Resumen con Dona SVG */}
        <View className="bg-card border border-border rounded-[32px] p-6 mb-6 items-center relative overflow-hidden shadow-2xl">
          {/* Círculo de fondo brillante decorativo */}
          <View className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          
          <CalorieDoughnut consumed={consumed} goal={calorieGoal} />

          <View className="flex-row justify-around w-full mt-6 border-t border-neutral-800 pt-4">
            <View className="items-center">
              <Flame size={20} color="#f97316" />
              <Text className="text-white font-bold text-sm mt-1">{stats?.caloriesBurned || 0}</Text>
              <Text className="text-muted-foreground text-[10px] uppercase font-bold mt-0.5">Quemadas</Text>
            </View>
            <View className="items-center">
              <Droplets size={20} color="#3b82f6" />
              <Text className="text-white font-bold text-sm mt-1">{( (stats?.waterMl || 0) / 1000 ).toFixed(1)}L</Text>
              <Text className="text-muted-foreground text-[10px] uppercase font-bold mt-0.5">Agua</Text>
            </View>
          </View>
        </View>

        {/* Estadísticas de Macronutrientes */}
        <View className="bg-card border border-border rounded-[32px] p-6 mb-6">
          <Text className="text-lg font-black text-white tracking-tight mb-4">
            Distribución de Macros
          </Text>
          
          <MacroProgressBar
            label="Proteínas"
            current={stats?.protein || 0}
            target={pTarget}
            colorClass="bg-rose-500"
          />
          <MacroProgressBar
            label="Carbohidratos"
            current={stats?.carbs || 0}
            target={cTarget}
            colorClass="bg-amber-500"
          />
          <MacroProgressBar
            label="Grasas"
            current={stats?.fat || 0}
            target={fTarget}
            colorClass="bg-emerald-500"
          />
        </View>

        {/* Tarjeta de Información e Incentivo */}
        <View className="bg-card border border-border rounded-[32px] p-6 mb-8 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <View className="flex-row items-center mb-1 gap-1">
              <Zap size={14} color="#10b981" />
              <Text className="text-primary text-xs uppercase font-extrabold tracking-wider">
                Consejo del Día
              </Text>
            </View>
            <Text className="text-white font-medium text-xs leading-relaxed">
              Mantener un consumo de agua de 2.5L acelera tu metabolismo basal y mejora tu enfoque mental.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
