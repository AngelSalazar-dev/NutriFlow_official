export interface Observer {
  update(event: string, data: any): Promise<void>;
}

export class EventManager {
  private observers: Map<string, Observer[]> = new Map();

  subscribe(event: string, observer: Observer) {
    const list = this.observers.get(event) || [];
    list.push(observer);
    this.observers.set(event, list);
  }

  async notify(event: string, data: any) {
    const list = this.observers.get(event) || [];
    await Promise.all(list.map(observer => observer.update(event, data)));
  }
}

// Global instance
export const eventBus = new EventManager();

// Example Observer for Welcome Notification
import { NotificationFactory } from '../notifications/factory';

export class WelcomeNotificationObserver implements Observer {
  async update(event: string, data: any): Promise<void> {
    if (event === 'user:registered') {
      const notification = NotificationFactory.createNotification('in-app');
      await notification.send(data.userId, `¡Bienvenido a NutriFlow, ${data.name}! Estamos felices de tenerte.`);
    }
  }
}

// Initialize default observers
eventBus.subscribe('user:registered', new WelcomeNotificationObserver());
