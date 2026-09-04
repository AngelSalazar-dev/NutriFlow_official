import 'package:flutter/material.dart';
import '../../data/models/food_entry_model.dart';
import '../../data/repositories/food_repository.dart';

class FoodLogProvider with ChangeNotifier {
  final FoodRepository _foodRepository = FoodRepository();

  List<FoodEntryModel> _todayLogs = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<FoodEntryModel> get todayLogs => _todayLogs;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Split logs helper by mealType
  List<FoodEntryModel> getLogsByMealType(String mealType) {
    return _todayLogs.where((log) => log.mealType.toLowerCase() == mealType.toLowerCase()).toList();
  }

  int get caloriesConsumed => _todayLogs.fold(0, (sum, item) => sum + item.calories);
  double get totalProtein => _todayLogs.fold(0.0, (sum, item) => sum + item.protein);
  double get totalCarbs => _todayLogs.fold(0.0, (sum, item) => sum + item.carbs);
  double get totalFat => _todayLogs.fold(0.0, (sum, item) => sum + item.fat);

  Future<List<Map<String, dynamic>>> searchFood(String query) async {
    return await _foodRepository.searchFood(query);
  }

  Future<void> smartLog(String description) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _foodRepository.smartLog(description);
      await fetchFoodLogs();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> fetchFoodLogs() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _todayLogs = await _foodRepository.getTodayFoodLogs();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logFoodItem({
    required String foodName,
    String? brand,
    required int calories,
    required double protein,
    required double carbs,
    required double fat,
    required double servingSize,
    required String servingName,
    required String mealType,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _foodRepository.logFood(
        foodName: foodName,
        brand: brand,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat,
        servingSize: servingSize,
        servingName: servingName,
        mealType: mealType,
      );
      await fetchFoodLogs();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> removeFoodItem(String id) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _foodRepository.deleteFoodLog(id);
      await fetchFoodLogs();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
    }
  }
}
