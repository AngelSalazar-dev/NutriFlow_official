import 'dart:convert';
import '../../core/network/api_client.dart';

class ChatRepository {
  final ApiClient _apiClient = ApiClient();

  Future<Map<String, dynamic>> sendMessage(
    String message, {
    List<Map<String, dynamic>> history = const [],
    String? conversationId,
  }) async {
    final response = await _apiClient.post(
      '/chat/message',
      {
        'message': message,
        'conversationHistory': history,
        if (conversationId != null) 'conversationId': conversationId,
      },
      requireAuth: true,
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        return {
          'message': data['message'] as String,
          'conversationId': data['conversationId'] as String,
        };
      }
    }
    
    final errorMsg = jsonDecode(response.body)['error'] ?? 'Error al enviar mensaje a la IA';
    throw Exception(errorMsg);
  }
}
