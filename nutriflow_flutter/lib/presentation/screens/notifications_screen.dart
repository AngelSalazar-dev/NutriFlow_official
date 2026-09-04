import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../providers/notification_provider.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<NotificationProvider>().fetchNotifications();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<NotificationProvider>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: [
            const Icon(Icons.notifications_outlined, color: AppTheme.primary, size: 24),
            const SizedBox(width: 8),
            const Text(
              'Notifications',
              style: TextStyle(fontFamily: 'Outfit', fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            if (provider.unreadCount > 0) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppTheme.primary,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '${provider.unreadCount}',
                  style: const TextStyle(fontFamily: 'Inter', fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ],
          ],
        ),
        actions: [
          if (provider.unreadCount > 0)
            TextButton(
              onPressed: () {
                final ids = provider.notifications.where((n) => !n.isRead).map((n) => n.id).toList();
                provider.markAsRead(ids);
              },
              child: const Text('Mark all read', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold, fontSize: 13)),
            ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => provider.fetchNotifications(),
        color: AppTheme.primary,
        backgroundColor: AppTheme.cardBg,
        child: provider.isLoading
            ? const Center(child: CircularProgressIndicator(color: AppTheme.primary))
            : provider.notifications.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.notifications_off_outlined, size: 64, color: AppTheme.textMuted),
                        const SizedBox(height: 16),
                        const Text(
                          'No notifications yet',
                          style: TextStyle(fontFamily: 'Outfit', fontSize: 18, color: AppTheme.textSecondary),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Stay tuned for updates and reminders',
                          style: TextStyle(fontFamily: 'Inter', fontSize: 13, color: AppTheme.textMuted),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: provider.notifications.length,
                    itemBuilder: (context, index) {
                      final notification = provider.notifications[index];
                      return Dismissible(
                        key: Key(notification.id),
                        direction: DismissDirection.endToStart,
                        background: Container(
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          margin: const EdgeInsets.only(bottom: 8),
                          decoration: BoxDecoration(
                            color: AppTheme.tertiary,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(Icons.delete_outline, color: Colors.white),
                        ),
                        onDismissed: (_) => provider.deleteNotification(notification.id),
                        child: GestureDetector(
                          onTap: () {
                            if (!notification.isRead) {
                              provider.markAsRead([notification.id]);
                            }
                          },
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: notification.isRead ? AppTheme.cardBg : AppTheme.cardBg.withValues(alpha: 0.8),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: notification.isRead ? AppTheme.border : AppTheme.primary.withValues(alpha: 0.3),
                              ),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: notification.isRead ? AppTheme.border : AppTheme.primary.withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Icon(
                                    notification.type == 'goal' ? Icons.flag : Icons.info_outline,
                                    color: notification.isRead ? AppTheme.textMuted : AppTheme.primary,
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Expanded(
                                            child: Text(
                                              notification.title,
                                              style: TextStyle(
                                                fontFamily: 'Inter',
                                                fontWeight: notification.isRead ? FontWeight.w500 : FontWeight.bold,
                                                color: notification.isRead ? AppTheme.textSecondary : Colors.white,
                                                fontSize: 14,
                                              ),
                                            ),
                                          ),
                                          if (!notification.isRead)
                                            Container(
                                              width: 8,
                                              height: 8,
                                              decoration: const BoxDecoration(
                                                color: AppTheme.primary,
                                                shape: BoxShape.circle,
                                              ),
                                            ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        notification.message,
                                        style: const TextStyle(fontFamily: 'Inter', fontSize: 12, color: AppTheme.textMuted),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        _timeAgo(notification.createdAt),
                                        style: const TextStyle(fontFamily: 'Inter', fontSize: 10, color: AppTheme.textMuted),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
      ),
    );
  }

  String _timeAgo(DateTime date) {
    final diff = DateTime.now().difference(date);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}
