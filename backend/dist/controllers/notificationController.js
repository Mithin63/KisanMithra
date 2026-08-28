"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationAsRead = exports.getUserNotifications = void 0;
const mockStore_1 = require("../store/mockStore");
const getUserNotifications = (req, res) => {
    const userId = parseInt(req.params.userId);
    const userNotifications = mockStore_1.mockStore.notifications.filter(n => n.user_id === userId);
    return res.json({
        success: true,
        unreadCount: userNotifications.filter(n => !n.read).length,
        notifications: userNotifications
    });
};
exports.getUserNotifications = getUserNotifications;
const markNotificationAsRead = (req, res) => {
    const id = parseInt(req.params.id);
    const notification = mockStore_1.mockStore.notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
    }
    return res.json({ success: true, notification });
};
exports.markNotificationAsRead = markNotificationAsRead;
