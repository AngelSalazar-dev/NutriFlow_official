import 'dart:convert';
import '../../core/network/api_client.dart';
import '../models/notification_model.dart';

class NotificationRepository {
  final ApiClient _apiClient = ApiClient();

  Future<List<NotificationModel>> getNotifications() async {
    final response = await _apiClient.get('/notifications');
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true && data['notifications'] != null) {
        final List<dynamic> list = data['notifications'];
        return list.map((json) => NotificationModel.fromJson(json)).toList();
      }
    }
    return [];
  }

  Future<void> markAsRead(List<String> ids) async {
    await _apiClient.patch('/notifications', {'ids': ids});
  }

  Future<void> deleteNotification(String id) async {
    await _apiClient.delete('/notifications?id=$id');
  }
}
