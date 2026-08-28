import { Request, Response } from 'express';
import { mockStore } from '../store/mockStore';

export const getUserNotifications = (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const userNotifications = mockStore.notifications.filter(n => n.user_id === userId);

  return res.json({
    success: true,
    unreadCount: userNotifications.filter(n => !n.read).length,
    notifications: userNotifications
  });
};

export const markNotificationAsRead = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const notification = mockStore.notifications.find(n => n.id === id);

  if (notification) {
    notification.read = true;
  }

  return res.json({ success: true, notification });
};
