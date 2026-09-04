import 'package:flutter/material.dart';
import '../../data/models/daily_log_model.dart';
import '../../data/repositories/stats_repository.dart';

class DashboardProvider with ChangeNotifier {
  final StatsRepository _statsRepository = StatsRepository();

  DailyLogModel? _todayStats;
  List<DailyLogModel> _historyStats = [];
  bool _isLoading = false;
  String? _errorMessage;

  DailyLogModel? get todayStats => _todayStats;
  List<DailyLogModel> get historyStats => _historyStats;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchTodayStats() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _todayStats = await _statsRepository.getTodayStats();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchHistory({int days = 7}) async {
    try {
      _historyStats = await _statsRepository.getHistory(days: days);
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
    }
  }

  Future<void> addWater(int amountMl) async {
    if (_todayStats == null) return;
    
    // Optimistic update for beautiful premium responsive feel
    final currentWater = _todayStats!.waterMl;
    _todayStats = DailyLogModel(
      caloriesConsumed: _todayStats!.caloriesConsumed,
      caloriesBurned: _todayStats!.caloriesBurned,
      protein: _todayStats!.protein,
      carbs: _todayStats!.carbs,
      fat: _todayStats!.fat,
      waterMl: currentWater + amountMl,
    );
    notifyListeners();

    try {
      await _statsRepository.logHydration(amountMl);
      // Re-fetch to synchronize state accurately with server
      await fetchTodayStats();
    } catch (e) {
      // Revert optimistic update on failure
      _todayStats = DailyLogModel(
        caloriesConsumed: _todayStats!.caloriesConsumed,
        caloriesBurned: _todayStats!.caloriesBurned,
        protein: _todayStats!.protein,
        carbs: _todayStats!.carbs,
        fat: _todayStats!.fat,
        waterMl: currentWater,
      );
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
    }
  }
}
