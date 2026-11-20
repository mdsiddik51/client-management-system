import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = Router();

router.use(authenticate);

// GET /api/notifications  — list user's notifications
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = { userId: req.user.id };
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ ...filter, isRead: false }),
    ]);

    return successResponse(res, notifications, 'Notifications fetched', 200, {
      total,
      page,
      limit,
      unreadCount,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notifications/read-all  — mark all as read
router.put('/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { $set: { isRead: true } });
    return successResponse(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
});

// PUT /api/notifications/:id/read  — mark one as read
router.put('/:id/read', async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { isRead: true } },
      { new: true }
    );
    if (!notification) return errorResponse(res, 'Notification not found', 404);
    return successResponse(res, notification, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
});

export default router;
