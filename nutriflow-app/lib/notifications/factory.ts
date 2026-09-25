import { query } from '../mysql';

export interface Notification {
  send(userId: string, message: string): Promise<void>;
}

class InAppNotification implements Notification {
  async send(userId: string, message: string): Promise<void> {
    await query(
      'INSERT INTO notifications (id, user_id, type, title, message, is_read, created_at) VALUES (UUID(), ?, "info", "Sistema", ?, 0, NOW())',
      [userId, message]
    );
    console.log(`[Notification] In-App sent to ${userId}: ${message}`);
  }
}

class EmailNotification implements Notification {
  async send(userId: string, message: string): Promise<void> {
    // Logic for email sending (placeholder)
    console.log(`[Notification] Email sent to ${userId}: ${message}`);
  }
}

export class NotificationFactory {
  static createNotification(type: 'in-app' | 'email'): Notification {
    switch (type) {
      case 'in-app': return new InAppNotification();
      case 'email': return new EmailNotification();
      default: throw new Error('Invalid notification type');
    }
  }
}
