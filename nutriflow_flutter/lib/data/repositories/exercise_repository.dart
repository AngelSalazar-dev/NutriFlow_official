import 'dart:convert';
import '../../core/network/api_client.dart';
import '../models/exercise_entry_model.dart';

class ExerciseRepository {
  final ApiClient _apiClient = ApiClient();

  Future<List<ExerciseEntryModel>> getTodayLogs({String? date}) async {
    final query = date != null ? '?date=$date' : '';
    final response = await _apiClient.get('/exercise/log$query');
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true && data['logs'] != null) {
        final List<dynamic> logsJson = data['logs'];
        return logsJson.map((json) => ExerciseEntryModel.fromJson(json)).toList();
      }
    }
    throw Exception('Error al cargar ejercicios');
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
    final response = await _apiClient.post(
      '/exercise/log',
      {
        'exerciseName': exerciseName,
        'exerciseType': exerciseType,
        'muscleGroups': muscleGroups,
        'durationMinutes': durationMinutes,
        if (metValue != null) 'metValue': metValue,
        'notes': notes,
        'setsData': setsData,
      },
    );

    if (response.statusCode != 200) {
      final errorMsg = jsonDecode(response.body)['error'] ?? 'Error al registrar ejercicio';
      throw Exception(errorMsg);
    }
  }

  Future<void> deleteLog(String id) async {
    final response = await _apiClient.delete('/exercise/log?id=$id');
    if (response.statusCode != 200) {
      throw Exception('Error al eliminar ejercicio');
    }
  }
}
