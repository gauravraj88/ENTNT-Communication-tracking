const Notification = require('../models/Notification');

const notificationController = {
    // Get all notifications
    getAllNotifications: async (req, res) => {
        try {
            const notifs = await Notification.find();
            res.status(200).json(notifs);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }
};

module.exports = notificationController;