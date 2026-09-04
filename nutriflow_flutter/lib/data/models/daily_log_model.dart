class DailyLogModel {
  final int caloriesConsumed;
  final int caloriesBurned;
  final int protein;
  final int carbs;
  final int fat;
  final int waterMl;

  DailyLogModel({
    required this.caloriesConsumed,
    required this.caloriesBurned,
    required this.protein,
    required this.carbs,
    required this.fat,
    required this.waterMl,
  });

  factory DailyLogModel.fromJson(Map<String, dynamic> json) {
    return DailyLogModel(
      caloriesConsumed: json['caloriesConsumed'] is int ? json['caloriesConsumed'] : (json['caloriesConsumed'] as num?)?.toInt() ?? 0,
      caloriesBurned: json['caloriesBurned'] is int ? json['caloriesBurned'] : (json['caloriesBurned'] as num?)?.toInt() ?? 0,
      protein: json['protein'] is int ? json['protein'] : (json['protein'] as num?)?.toInt() ?? 0,
      carbs: json['carbs'] is int ? json['carbs'] : (json['carbs'] as num?)?.toInt() ?? 0,
      fat: json['fat'] is int ? json['fat'] : (json['fat'] as num?)?.toInt() ?? 0,
      waterMl: json['waterMl'] is int ? json['waterMl'] : (json['waterMl'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'caloriesConsumed': caloriesConsumed,
      'caloriesBurned': caloriesBurned,
      'protein': protein,
      'carbs': carbs,
      'fat': fat,
      'waterMl': waterMl,
    };
  }
}
