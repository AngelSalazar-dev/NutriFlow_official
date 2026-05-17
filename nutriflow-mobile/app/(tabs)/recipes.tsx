import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image, Modal } from 'react-native';
import api from '../../lib/api';
import { Search, Clock, ChevronRight, X, Sparkles, BookOpen } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Recipe {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  readTime: number;
}

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal states
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const res = await api.get('/articles');
      if (res.data && res.data.articles) {
        // Filtramos solo los artículos de la categoría 'recipes'
        const filtered = res.data.articles.filter((item: any) => item.category === 'recipes');
        setRecipes(filtered);
      }
    } catch (err) {
      console.log('Error cargando recetas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecipes = recipes.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openRecipeDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
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
          <Text className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">Catálogo</Text>
          <Text className="text-3xl font-black text-white tracking-tighter">Recetas Saludables</Text>
        </View>

        {/* Buscador de recetas */}
        <View className="flex-row items-center bg-card border border-border rounded-2xl px-4 py-3 mb-6">
          <Search size={18} color="#737373" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar recetas por ingrediente o nombre..."
            placeholderTextColor="#737373"
            className="flex-1 text-white text-base ml-2 h-8"
          />
        </View>

        {/* Lista de recetas */}
        {filteredRecipes.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <BookOpen size={48} color="#737373" className="opacity-40 mb-3" />
            <Text className="text-neutral-500 text-sm text-center">No se encontraron recetas</Text>
          </View>
        ) : (
          filteredRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe._id}
              onPress={() => openRecipeDetails(recipe)}
              activeOpacity={0.9}
              className="bg-card border border-border rounded-[28px] overflow-hidden mb-6 shadow-xl"
            >
              {/* Imagen de cobertura */}
              <Image
                source={{
                  uri: recipe.coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'
                }}
                className="w-full h-44 object-cover"
              />
              
              <View className="p-5">
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="flex-row items-center bg-emerald-900/30 border border-emerald-500/20 px-3 py-1 rounded-xl">
                    <Clock size={12} color="#10b981" />
                    <Text className="text-primary font-extrabold text-[10px] uppercase ml-1">
                      {recipe.readTime} min
                    </Text>
                  </View>
                  <Text className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                    Cocina y Nutrición
                  </Text>
                </View>

                <Text className="text-white text-xl font-black tracking-tight mb-2">
                  {recipe.title}
                </Text>
                <Text className="text-muted-foreground text-xs leading-relaxed" numberOfLines={2}>
                  {recipe.excerpt}
                </Text>

                <View className="flex-row justify-end mt-4">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-primary font-bold text-xs">Ver Receta</Text>
                    <ChevronRight size={14} color="#10b981" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Modal de Detalle de Receta */}
        {selectedRecipe && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
          >
            <SafeAreaView className="flex-1 bg-background" edges={['top']}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-4">
                {/* Header del Modal */}
                <View className="flex-row justify-between items-center mb-6">
                  <View className="flex-row items-center bg-emerald-900/30 border border-emerald-500/20 px-3 py-1 rounded-xl">
                    <Sparkles size={14} color="#10b981" />
                    <Text className="text-primary font-extrabold text-[10px] uppercase ml-1">
                      NutriFlow Gourmet
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setIsModalOpen(false)} className="p-2 bg-card border border-border rounded-full">
                    <X size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <Image
                  source={{
                    uri: selectedRecipe.coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'
                  }}
                  className="w-full h-56 rounded-[32px] mb-6 object-cover"
                />

                <View className="space-y-4 mb-10">
                  <Text className="text-3xl font-black text-white tracking-tighter">
                    {selectedRecipe.title}
                  </Text>

                  <View className="flex-row items-center gap-2">
                    <Clock size={16} color="#737373" />
                    <Text className="text-muted-foreground text-sm font-semibold">
                      Tiempo estimado: {selectedRecipe.readTime} minutos
                    </Text>
                  </View>

                  <View className="border-t border-neutral-800 pt-4">
                    <Text className="text-white text-lg font-black tracking-tight mb-2">
                      Resumen
                    </Text>
                    <Text className="text-muted-foreground text-sm leading-relaxed">
                      {selectedRecipe.excerpt}
                    </Text>
                  </View>

                  <View className="border-t border-neutral-800 pt-4">
                    <Text className="text-white text-lg font-black tracking-tight mb-3">
                      Instrucciones y Preparación
                    </Text>
                    <Text className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
                      {selectedRecipe.content || 'Instrucciones en desarrollo.'}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
