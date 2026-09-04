import 'dart:convert';
import '../../core/network/api_client.dart';
import '../models/food_entry_model.dart';

class FoodRepository {
  final ApiClient _apiClient = ApiClient();

  Future<List<Map<String, dynamic>>> searchFood(String query) async {
    final response = await _apiClient.get('/food/search?q=$query');
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true && data['foods'] != null) {
        return List<Map<String, dynamic>>.from(data['foods']);
      }
    }
    return [];
  }

  Future<void> smartLog(String description) async {
    final response = await _apiClient.post(
      '/food/smart-log',
      {'description': description},
    );
    if (response.statusCode != 200) {
      final errorMsg = jsonDecode(response.body)['error'] ?? 'Error al procesar descripción';
      throw Exception(errorMsg);
    }
  }

  Future<List<FoodEntryModel>> getTodayFoodLogs() async {
    final response = await _apiClient.get('/food/today', requireAuth: true);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true && data['logs'] != null) {
        final List<dynamic> logsJson = data['logs'];
        return logsJson.map((json) => FoodEntryModel.fromJson(json)).toList();
      }
    }
    throw Exception('Error al cargar diario de alimentos');
  }

  Future<void> logFood({
    required String foodName,
    String? brand,
    required int calories,
    required double protein,
    required double carbs,
    required double fat,
    required double servingSize,
    required String servingName,
    required String mealType,
    bool isCustom = true,
  }) async {
    final response = await _apiClient.post(
      '/food/log',
      {
        'foodName': foodName,
        'brand': brand,
        'calories': calories,
        'protein': protein,
        'carbs': carbs,
        'fat': fat,
        'servingSize': servingSize,
        'servingName': servingName,
        'mealType': mealType.toLowerCase(),
        'isCustom': isCustom,
        'date': DateTime.now().toIso8601String(),
      },
      requireAuth: true,
    );

    if (response.statusCode != 200) {
      final errorMsg = jsonDecode(response.body)['error'] ?? 'Error al registrar alimento';
      throw Exception(errorMsg);
    }
  }

  Future<void> deleteFoodLog(String id) async {
    final response = await _apiClient.delete('/food/log?id=$id', requireAuth: true);
    if (response.statusCode != 200) {
      throw Exception('Error al eliminar registro de comida');
    }
  }
}
