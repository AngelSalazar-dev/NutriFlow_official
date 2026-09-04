import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/network/api_client.dart';
import '../models/user_model.dart';

class AuthRepository {
  final ApiClient _apiClient = ApiClient();

  Future<UserModel?> login(String email, String password) async {
    final response = await _apiClient.post(
      '/auth/login',
      {'email': email, 'password': password},
      requireAuth: false,
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        final token = data['token'];
        final userJson = data['user'];

        // Persist token in shared preferences
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);

        return UserModel.fromJson(userJson);
      }
    }
    
    // Throw error containing backend message if any
    try {
      final errorData = jsonDecode(response.body);
      throw Exception(errorData['error'] ?? 'Error al iniciar sesión');
    } catch (_) {
      throw Exception('Credenciales incorrectas o error de servidor');
    }
  }

  Future<UserModel?> register({
    required String email,
    required String password,
    required String confirmPassword,
    required String name,
    required int age,
    required String sex,
    required double weight,
    required double height,
    required String activityLevel,
    required String goal,
    String? referralCode,
  }) async {
    final response = await _apiClient.post(
      '/auth/register',
      {
        'email': email,
        'password': password,
        'confirmPassword': confirmPassword,
        'name': name,
        'age': age,
        'sex': sex,
        'weight': weight,
        'height': height,
        'activityLevel': activityLevel,
        'goal': goal,
        if (referralCode != null && referralCode.isNotEmpty) 'referralCode': referralCode,
      },
      requireAuth: false,
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        final token = data['token'];
        final userJson = data['user'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);

        return UserModel.fromJson(userJson);
      }
    }

    try {
      final errorData = jsonDecode(response.body);
      throw Exception(errorData['error'] ?? 'Error al registrar usuario');
    } catch (_) {
      throw Exception('Error al registrar usuario. Inténtalo de nuevo.');
    }
  }

  Future<void> logout() async {
    // API logout (optional but clean)
    try {
      await _apiClient.post('/auth/logout', {}, requireAuth: true);
    } catch (_) {}

    // Clear local storage
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  Future<UserModel?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token == null) return null;

    final response = await _apiClient.get('/auth/profile', requireAuth: true);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['user'] != null) {
        return UserModel.fromJson(data['user']);
      }
    }
    return null;
  }

  Future<UserModel?> updateProfile({
    String? name,
    int? age,
    String? sex,
    double? weight,
    double? height,
    String? activityLevel,
    String? goal,
  }) async {
    final Map<String, dynamic> body = {};
    if (name != null) body['name'] = name;
    if (age != null) body['age'] = age;
    if (sex != null) body['sex'] = sex;
    if (weight != null) body['weight'] = weight;
    if (height != null) body['height'] = height;
    if (activityLevel != null) body['activityLevel'] = activityLevel;
    if (goal != null) body['goal'] = goal;

    final response = await _apiClient.put('/auth/profile', body, requireAuth: true);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['user'] != null) {
        return UserModel.fromJson(data['user']);
      }
    }

    try {
      final errorData = jsonDecode(response.body);
      throw Exception(errorData['error'] ?? 'Error al actualizar perfil');
    } catch (_) {
      throw Exception('Error al actualizar perfil. Inténtalo de nuevo.');
    }
  }
}
