import 'package:flutter/material.dart';
import '../../data/models/exercise_entry_model.dart';
import '../../data/repositories/exercise_repository.dart';

class ExerciseProvider with ChangeNotifier {
  final ExerciseRepository _exerciseRepository = ExerciseRepository();

  List<ExerciseEntryModel> _todayLogs = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<ExerciseEntryModel> get todayLogs => _todayLogs;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  int get totalCaloriesBurned =>
      _todayLogs.fold(0, (sum, item) => sum + item.caloriesBurned);

  Future<void> fetchTodayLogs({String? date}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _todayLogs = await _exerciseRepository.getTodayLogs(date: date);
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logExercise({
    required String exerciseName,
    required String exerciseType,
    required List<String> muscleGroups,
    required int durationMinutes,
    double? metValue,
    String? notes,
    List<Map<String, dynamic>>? setsData,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _exerciseRepository.logExercise(
        exerciseName: exerciseName,
        exerciseType: exerciseType,
        muscleGroups: muscleGroups,
        durationMinutes: durationMinutes,
        metValue: metValue,
        notes: notes,
        setsData: setsData,
      );
      await fetchTodayLogs();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> deleteLog(String id) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _exerciseRepository.deleteLog(id);
      await fetchTodayLogs();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
    }
  }
}
