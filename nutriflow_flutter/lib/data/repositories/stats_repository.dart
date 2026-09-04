import 'dart:convert';
import '../../core/network/api_client.dart';
import '../models/daily_log_model.dart';

class StatsRepository {
  final ApiClient _apiClient = ApiClient();

  Future<DailyLogModel> getTodayStats() async {
    final response = await _apiClient.get('/stats/today', requireAuth: true);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['stats'] != null) {
        return DailyLogModel.fromJson(data['stats']);
      }
    }
    throw Exception('Error al obtener métricas del día');
  }

  Future<List<DailyLogModel>> getHistory({int days = 7}) async {
    final response = await _apiClient.get('/stats/history?days=$days');
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true && data['stats'] != null) {
        final List<dynamic> statsJson = data['stats'];
        return statsJson.map((json) => DailyLogModel.fromJson(json)).toList();
      }
    }
    throw Exception('Error al obtener historial');
  }

  Future<void> logHydration(int amountMl) async {
    final response = await _apiClient.post(
      '/hydration/quick',
      {
        'amountMl': amountMl,
        'beverageType': 'water',
      },
      requireAuth: true,
    );
    if (response.statusCode != 200) {
      throw Exception('Error al guardar hidratación');
    }
  }
}
