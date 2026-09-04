import 'package:flutter/material.dart';
import '../../data/models/notification_model.dart';
import '../../data/repositories/notification_repository.dart';

class NotificationProvider with ChangeNotifier {
  final NotificationRepository _repository = NotificationRepository();

  List<NotificationModel> _notifications = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<NotificationModel> get notifications => _notifications;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  Future<void> fetchNotifications() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _notifications = await _repository.getNotifications();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> markAsRead(List<String> ids) async {
    try {
      await _repository.markAsRead(ids);
      for (var notification in _notifications) {
        if (ids.contains(notification.id)) {
          _notifications[_notifications.indexOf(notification)] = NotificationModel(
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            isRead: true,
            createdAt: notification.createdAt,
          );
        }
      }
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
    }
  }

  Future<void> deleteNotification(String id) async {
    try {
      await _repository.deleteNotification(id);
      _notifications.removeWhere((n) => n.id == id);
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
    }
  }
}
