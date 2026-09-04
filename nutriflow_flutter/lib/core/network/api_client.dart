import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();

  String get baseUrl => dotenv.env['API_URL'] ?? 'http://localhost:3000/api';

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<Map<String, String>> _getHeaders({bool requireAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (requireAuth) {
      final token = await _getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  Future<http.Response> get(String path, {bool requireAuth = true}) async {
    final url = Uri.parse('$baseUrl$path');
    final headers = await _getHeaders(requireAuth: requireAuth);
    final response = await http.get(url, headers: headers);
    _checkUnauthorized(response);
    return response;
  }

  Future<http.Response> post(String path, Map<String, dynamic> body, {bool requireAuth = true}) async {
    final url = Uri.parse('$baseUrl$path');
    final headers = await _getHeaders(requireAuth: requireAuth);
    final response = await http.post(url, headers: headers, body: jsonEncode(body));
    _checkUnauthorized(response);
    return response;
  }

  Future<http.Response> put(String path, Map<String, dynamic> body, {bool requireAuth = true}) async {
    final url = Uri.parse('$baseUrl$path');
    final headers = await _getHeaders(requireAuth: requireAuth);
    final response = await http.put(url, headers: headers, body: jsonEncode(body));
    _checkUnauthorized(response);
    return response;
  }

  Future<http.Response> patch(String path, Map<String, dynamic> body, {bool requireAuth = true}) async {
    final url = Uri.parse('$baseUrl$path');
    final headers = await _getHeaders(requireAuth: requireAuth);
    final response = await http.patch(url, headers: headers, body: jsonEncode(body));
    _checkUnauthorized(response);
    return response;
  }

  Future<http.Response> delete(String path, {bool requireAuth = true}) async {
    final url = Uri.parse('$baseUrl$path');
    final headers = await _getHeaders(requireAuth: requireAuth);
    final response = await http.delete(url, headers: headers);
    _checkUnauthorized(response);
    return response;
  }

  void _checkUnauthorized(http.Response response) async {
    if (response.statusCode == 401) {
      // Clear expired token on unauthorized error
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('auth_token');
    }
  }
}
