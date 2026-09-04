class FoodEntryModel {
  final String id;
  final String foodName;
  final String? brand;
  final int calories;
  final double protein;
  final double carbs;
  final double fat;
  final double servingSize;
  final String servingName;
  final String mealType;
  final String date;
  final bool isCustom;

  FoodEntryModel({
    required this.id,
    required this.foodName,
    this.brand,
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fat,
    required this.servingSize,
    required this.servingName,
    required this.mealType,
    required this.date,
    required this.isCustom,
  });

  factory FoodEntryModel.fromJson(Map<String, dynamic> json) {
    return FoodEntryModel(
      id: json['id']?.toString() ?? '',
      foodName: json['foodName'] ?? '',
      brand: json['brand'],
      calories: json['calories'] is int ? json['calories'] : (json['calories'] as num?)?.toInt() ?? 0,
      protein: json['protein'] is num ? (json['protein'] as num).toDouble() : 0.0,
      carbs: json['carbs'] is num ? (json['carbs'] as num).toDouble() : 0.0,
      fat: json['fat'] is num ? (json['fat'] as num).toDouble() : 0.0,
      servingSize: json['servingSize'] is num ? (json['servingSize'] as num).toDouble() : 100.0,
      servingName: json['servingName'] ?? 'g',
      mealType: json['mealType'] ?? 'Snack',
      date: json['date'] ?? '',
      isCustom: (json['isCustom'] == 1 || json['isCustom'] == true),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'foodName': foodName,
      'brand': brand,
      'calories': calories,
      'protein': protein,
      'carbs': carbs,
      'fat': fat,
      'servingSize': servingSize,
      'servingName': servingName,
      'mealType': mealType,
      'date': date,
      'isCustom': isCustom,
    };
  }
}
