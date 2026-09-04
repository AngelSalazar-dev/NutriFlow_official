class ExerciseEntryModel {
  final String id;
  final String exerciseName;
  final String exerciseType;
  final List<String> muscleGroups;
  final double? metValue;
  final int durationMinutes;
  final int caloriesBurned;
  final String? notes;
  final String logDate;
  final List<Map<String, dynamic>>? setsData;

  ExerciseEntryModel({
    required this.id,
    required this.exerciseName,
    required this.exerciseType,
    required this.muscleGroups,
    this.metValue,
    required this.durationMinutes,
    required this.caloriesBurned,
    this.notes,
    required this.logDate,
    this.setsData,
  });

  factory ExerciseEntryModel.fromJson(Map<String, dynamic> json) {
    return ExerciseEntryModel(
      id: json['id']?.toString() ?? '',
      exerciseName: json['exerciseName'] ?? json['exercise_name'] ?? '',
      exerciseType: json['exerciseType'] ?? json['exercise_type'] ?? 'other',
      muscleGroups: (json['muscleGroups'] ?? json['muscle_groups'] ?? [])
          .cast<String>(),
      metValue: json['metValue'] is num
          ? (json['metValue'] as num).toDouble()
          : null,
      durationMinutes:
          json['durationMinutes'] ?? json['duration_minutes'] ?? 0,
      caloriesBurned:
          json['caloriesBurned'] ?? json['calories_burned'] ?? 0,
      notes: json['notes'],
      logDate: json['logDate'] ?? json['log_date'] ?? '',
      setsData: json['setsData'] is List
          ? (json['setsData'] as List).cast<Map<String, dynamic>>()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'exerciseName': exerciseName,
      'exerciseType': exerciseType,
      'muscleGroups': muscleGroups,
      'metValue': metValue,
      'durationMinutes': durationMinutes,
      'notes': notes,
      'logDate': logDate,
      'setsData': setsData,
    };
  }
}
