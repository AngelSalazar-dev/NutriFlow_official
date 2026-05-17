import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Search, Flame, Droplets, Plus, Trash2, X, ChevronRight, Apple } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FoodLog {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingName?: string;
  mealType: string;
  date: string;
}

export default function FoodLogScreen() {
  const { user } = useAuth();
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [waterTotal, setWaterTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Modal / Selection states
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [servingSize, setServingSize] = useState('100');
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      
      const [foodRes, hydrationRes] = await Promise.all([
        api.get(`/food/today?date=${todayStr}`),
        api.get(`/hydration/today?date=${todayStr}`)
      ]);

      if (foodRes.data && foodRes.data.logs) {
        setFoodLogs(foodRes.data.logs);
      }
      if (hydrationRes.data) {
        setWaterTotal(hydrationRes.data.totalMl || 0);
      }
    } catch (err) {
      console.log('Error cargando registros de hoy:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search logic for foods
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/food/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.data && res.data.foods) {
          setSearchResults(res.data.foods);
        }
      } catch (err) {
        console.log('Error buscando comida:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleAddWater = async (amount: number) => {
    try {
      const res = await api.post('/hydration/quick', {
        amountMl: amount,
        beverageType: 'water',
        date: new Date().toISOString()
      });
      if (res.status === 200 || res.status === 201) {
        setWaterTotal((prev) => prev + amount);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo registrar la hidratación');
    }
  };

  const handleDeleteFood = async (logId: string) => {
    try {
      const res = await api.delete(`/food/log?id=${logId}`);
      if (res.status === 200) {
        setFoodLogs((prev) => prev.filter((item) => item.id !== logId));
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo eliminar la comida');
    }
  };

  const handleSaveFood = async () => {
    if (!selectedFood) return;
    const grams = Number(servingSize);
    if (isNaN(grams) || grams <= 0) {
      Alert.alert('Error', 'Especifica una porción válida');
      return;
    }

    const ratio = grams / 100;
    const nutrition = {
      calories: Math.round((selectedFood.calories || 0) * ratio),
      protein: Math.round((selectedFood.protein || 0) * ratio * 10) / 10,
      carbs: Math.round((selectedFood.carbs || 0) * ratio * 10) / 10,
      fat: Math.round((selectedFood.fat || 0) * ratio * 10) / 10,
    };

    try {
      const res = await api.post('/food/log', {
        foodId: selectedFood.id,
        foodName: selectedFood.name,
        brand: selectedFood.brand || 'Verificado',
        ...nutrition,
        servingSize: grams,
        servingName: `${grams}g`,
        mealType: selectedMealType,
        date: new Date().toISOString(),
        isCustom: false
      });

      if (res.status === 200 || res.status === 201) {
        setIsModalOpen(false);
        setSelectedFood(null);
        setSearchQuery('');
        loadTodayData();
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo guardar el registro de comida');
    }
  };

  const openSelectionModal = (food: any) => {
    setSelectedFood(food);
    setServingSize(String(food.servingSize || 100));
    setIsModalOpen(true);
  };

  const renderMealGroup = (title: string, type: string, iconColor: string) => {
    const logs = foodLogs.filter((item) => item.mealType === type);
    const totalCal = logs.reduce((sum, item) => sum + item.calories, 0);

    return (
      <View className="bg-card border border-border rounded-[28px] p-5 mb-5">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center gap-2">
            <View className={`w-3 h-3 rounded-full ${iconColor}`} />
            <Text className="text-white font-extrabold text-lg">{title}</Text>
          </View>
          <Text className="text-muted-foreground text-sm font-bold">{totalCal} kcal</Text>
        </View>

        {logs.length === 0 ? (
          <Text className="text-neutral-500 text-xs py-2 italic">Sin registros para esta comida</Text>
        ) : (
          logs.map((item) => (
            <View key={item.id} className="flex-row justify-between items-center py-3 border-b border-neutral-800 last:border-0">
              <View className="flex-1 pr-2">
                <Text className="text-white font-bold text-sm" numberOfLines={1}>{item.foodName}</Text>
                <Text className="text-muted-foreground text-[10px] uppercase font-bold mt-0.5">
                  {item.servingSize}g • P:{item.protein}g C:{item.carbs}g G:{item.fat}g
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Text className="text-emerald-500 font-extrabold text-sm">{item.calories} kcal</Text>
                <TouchableOpacity onPress={() => handleDeleteFood(item.id)} className="p-1">
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-4">
        <View className="mb-6">
          <Text className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">Registros</Text>
          <Text className="text-3xl font-black text-white tracking-tighter">Diario de Comidas</Text>
        </View>

        {/* Buscador de alimentos */}
        <View className="mb-6 z-50">
          <View className="flex-row items-center bg-card border border-border rounded-2xl px-4 py-3">
            <Search size={18} color="#737373" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar alimentos en la base de datos..."
              placeholderTextColor="#737373"
              className="flex-1 text-white text-base ml-2 h-8"
            />
          </View>

          {/* Resultados de búsqueda flotantes */}
          {searchResults.length > 0 && (
            <View className="bg-card border border-border rounded-2xl mt-2 p-2 max-h-60 shadow-2xl overflow-scroll">
              {searchResults.map((food) => (
                <TouchableOpacity
                  key={food.id}
                  onPress={() => openSelectionModal(food)}
                  className="flex-row justify-between items-center p-3 border-b border-neutral-800 last:border-0"
                >
                  <View className="flex-row items-center gap-2 flex-1 pr-2">
                    <Apple size={16} color="#10b981" />
                    <Text className="text-white text-sm font-bold" numberOfLines={1}>
                      {food.name}
                    </Text>
                  </View>
                  <Text className="text-emerald-500 font-extrabold text-xs">{food.calories} kcal</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {isSearching && (
            <View className="py-4 justify-center items-center">
              <ActivityIndicator color="#10b981" size="small" />
            </View>
          )}
        </View>

        {/* Tarjeta de Registro de Hidratación Rápida */}
        <View className="bg-card border border-border rounded-[32px] p-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <Droplets size={20} color="#3b82f6" />
              <Text className="text-white font-extrabold text-lg">Hidratación Rápida</Text>
            </View>
            <Text className="text-blue-500 font-black text-base">{waterTotal} ml</Text>
          </View>
          
          <View className="flex-row justify-between">
            {[250, 500, 750].map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => handleAddWater(amount)}
                className="bg-neutral-800 hover:bg-neutral-700 py-3 rounded-2xl flex-1 mx-1 border border-neutral-700 items-center"
              >
                <Text className="text-white font-bold text-xs">+{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Grupos de Comida */}
        {renderMealGroup('Desayuno', 'breakfast', 'bg-orange-500')}
        {renderMealGroup('Almuerzo', 'lunch', 'bg-emerald-500')}
        {renderMealGroup('Cena', 'dinner', 'bg-indigo-500')}
        {renderMealGroup('Snacks', 'snack', 'bg-purple-500')}

        {/* Modal de Selección y Gramaje */}
        {selectedFood && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
          >
            <View className="flex-1 justify-end bg-black/60">
              <View className="bg-card border-t border-border rounded-t-[40px] p-8 space-y-6">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 pr-4">
                    <Text className="text-white text-2xl font-black tracking-tight" numberOfLines={1}>
                      {selectedFood.name}
                    </Text>
                    <Text className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">
                      {selectedFood.brand || 'Verificado'}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setIsModalOpen(false)} className="p-2 bg-neutral-800 rounded-full">
                    <X size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Selección de Tipo de Comida */}
                <View className="space-y-2">
                  <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">Comida del Día</Text>
                  <View className="flex-row justify-between bg-neutral-900 p-1 rounded-2xl border border-border">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setSelectedMealType(type)}
                        className={`flex-1 py-3 rounded-xl items-center ${selectedMealType === type ? 'bg-primary' : ''}`}
                      >
                        <Text className="text-white font-bold text-[10px] uppercase">
                          {type === 'breakfast' ? 'Desayuno' : type === 'lunch' ? 'Almuerzo' : type === 'dinner' ? 'Cena' : 'Snack'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Especificación de porción */}
                <View className="space-y-2">
                  <Text className="text-xs font-bold text-white uppercase tracking-widest pl-1">Cantidad (gramos)</Text>
                  <View className="flex-row items-center bg-neutral-900 rounded-2xl border border-border px-4 py-3">
                    <TextInput
                      value={servingSize}
                      onChangeText={setServingSize}
                      placeholder="100"
                      placeholderTextColor="#737373"
                      keyboardType="number-pad"
                      className="flex-1 text-white text-base h-10 ml-2"
                    />
                    <Text className="text-primary font-bold text-sm">gramos</Text>
                  </View>
                </View>

                {/* Botón de Guardado */}
                <TouchableOpacity
                  onPress={handleSaveFood}
                  activeOpacity={0.8}
                  className="w-full bg-primary py-4 rounded-2xl flex-row justify-center items-center shadow-lg"
                >
                  <Text className="text-white font-bold text-lg mr-2">Agregar al Diario</Text>
                  <Plus size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
