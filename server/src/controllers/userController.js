import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Better Auth stores users in the 'user' collection (singular)
const getUserCollection = () => mongoose.connection.collection('user');

const buildUserFilter = (id) => {
  const filters = [{ _id: id }, { id: id }];
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      filters.push({ _id: new mongoose.Types.ObjectId(id) });
    }
  } catch {}
  return { $or: filters };
};

// GET /api/users  (ADMIN only)
export const listUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const col = getUserCollection();
    const [users, total] = await Promise.all([
      col.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      col.countDocuments({}),
    ]);

    return successResponse(res, users, 'Users fetched', 200, { total, page, limit });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id  (ADMIN only)
export const getUser = async (req, res, next) => {
  try {
    const col = getUserCollection();
    const user = await col.findOne(buildUserFilter(req.params.id));
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id/role  (ADMIN only)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['ADMIN', 'CLIENT'].includes(role)) {
      return errorResponse(res, 'Invalid role. Must be ADMIN or CLIENT', 400);
    }

    const col = getUserCollection();
    const result = await col.findOneAndUpdate(
      buildUserFilter(req.params.id),
      { $set: { role, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    const updatedUser = result?.value || result;
    if (!updatedUser) return errorResponse(res, 'User not found', 404);

    await Activity.create({
      type: 'user_updated',
      userId: req.user.id,
      targetId: updatedUser._id,
      targetModel: 'User',
      description: `Role updated to ${role}`,
    });

    return successResponse(res, updatedUser, 'User role updated');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id  (ADMIN only)
export const deleteUser = async (req, res, next) => {
  try {
    const col = getUserCollection();
    const result = await col.findOneAndDelete(buildUserFilter(req.params.id));
    const deletedUser = result?.value || result;
    if (!deletedUser) return errorResponse(res, 'User not found', 404);
    return successResponse(res, null, 'User deleted');
  } catch (err) {
    next(err);
  }
};

// GET /api/users/profile  (any authenticated)
export const getProfile = async (req, res, next) => {
  try {
    const col = getUserCollection();
    const user = await col.findOne(buildUserFilter(req.user.id));
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/profile  (any authenticated)
export const updateProfile = async (req, res, next) => {
  try {
    // Disallow changing role via this endpoint
    const { role, ...updates } = req.body;
    const col = getUserCollection();
    const result = await col.findOneAndUpdate(
      buildUserFilter(req.user.id),
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    const updatedUser = result?.value || result;
    if (!updatedUser) return errorResponse(res, 'User not found', 404);
    return successResponse(res, updatedUser, 'Profile updated');
  } catch (err) {
    next(err);
  }
};
