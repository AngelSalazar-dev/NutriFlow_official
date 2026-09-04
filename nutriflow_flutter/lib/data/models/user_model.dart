class UserModel {
  final String id;
  final String email;
  final String name;
  final int age;
  final String sex;
  final double weight;
  final double height;
  final String activityLevel;
  final String goal;
  final String subscriptionPlan;
  final int calorieGoal;
  final double? tdee;
  final double? bmr;
  final String? avatarUrl;
  final String? avatarType;

  UserModel({
    required this.id,
    required this.email,
    required this.name,
    required this.age,
    required this.sex,
    required this.weight,
    required this.height,
    required this.activityLevel,
    required this.goal,
    required this.subscriptionPlan,
    required this.calorieGoal,
    this.tdee,
    this.bmr,
    this.avatarUrl,
    this.avatarType,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      age: json['age'] is int ? json['age'] : (json['age'] as num?)?.toInt() ?? 0,
      sex: json['sex'] ?? 'male',
      weight: json['weight'] is num ? (json['weight'] as num).toDouble() : 0.0,
      height: json['height'] is num ? (json['height'] as num).toDouble() : 0.0,
      activityLevel: json['activityLevel'] ?? json['activity_level'] ?? 'moderate',
      goal: json['goal'] ?? 'maintain',
      subscriptionPlan: json['subscriptionPlan'] ?? json['subscription_plan'] ?? 'free',
      calorieGoal: json['calorieGoal'] is int ? json['calorieGoal'] : (json['calorieGoal'] as num?)?.toInt() ?? 2000,
      tdee: json['tdee'] is num ? (json['tdee'] as num).toDouble() : null,
      bmr: json['bmr'] is num ? (json['bmr'] as num).toDouble() : null,
      avatarUrl: json['avatarUrl'] ?? json['avatar_url'],
      avatarType: json['avatarType'] ?? json['avatar_type'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'email': email,
      'name': name,
      'age': age,
      'sex': sex,
      'weight': weight,
      'height': height,
      'activityLevel': activityLevel,
      'goal': goal,
      'subscriptionPlan': subscriptionPlan,
      'calorieGoal': calorieGoal,
      'tdee': tdee,
      'bmr': bmr,
      'avatarUrl': avatarUrl,
      'avatarType': avatarType,
    };
  }
}
