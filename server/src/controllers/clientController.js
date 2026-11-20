import Client from '../models/Client.js';
import Activity from '../models/Activity.js';
import { successResponse, errorResponse } from '../utils/response.js';
import mongoose from 'mongoose';

// Helper: log activity
const logActivity = async (type, userId, targetId, description, metadata = {}) => {
  try {
    await Activity.create({ type, userId, targetId, targetModel: 'Client', description, metadata });
  } catch (_) {
    // non-fatal
  }
};

// GET /api/clients
export const getClients = async (req, res, next) => {
  try {
    const filter =
      req.user.role === 'CLIENT'
        ? {
            $or: [
              { userId: req.user.id },
              ...(req.user.email ? [{ email: req.user.email.toLowerCase() }] : []),
            ],
          }
        : {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
      ];
    }
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [clients, total] = await Promise.all([
      Client.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Client.countDocuments(filter),
    ]);

    return successResponse(res, clients, 'Clients fetched', 200, { total, page, limit });
  } catch (err) {
    next(err);
  }
};

// GET /api/clients/:id
export const getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return errorResponse(res, 'Client not found', 404);

    if (req.user.role === 'CLIENT') {
      const isOwner =
        String(client.userId) === String(req.user.id) ||
        (req.user.email && client.email?.toLowerCase() === req.user.email.toLowerCase());
      if (!isOwner) {
        return errorResponse(res, 'Forbidden', 403);
      }
    }

    return successResponse(res, client);
  } catch (err) {
    next(err);
  }
};

// POST /api/clients
export const createClient = async (req, res, next) => {
  try {
    const client = await Client.create(req.body);
    await logActivity('client_created', req.user.id, client._id, `Client ${client.fullName} created`);
    return successResponse(res, client, 'Client created', 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/clients/:id
export const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return errorResponse(res, 'Client not found', 404);

    let updateData = req.body;

    if (req.user.role === 'CLIENT') {
      const isOwner =
        String(client.userId) === String(req.user.id) ||
        (req.user.email && client.email?.toLowerCase() === req.user.email.toLowerCase());
      if (!isOwner) {
        return errorResponse(res, 'Forbidden', 403);
      }
      // Restrict client updates to non-sensitive profile fields
      const { fullName, phone, company, address, profileImage } = req.body;
      updateData = {};
      if (fullName !== undefined) updateData.fullName = fullName;
      if (phone !== undefined) updateData.phone = phone;
      if (company !== undefined) updateData.company = company;
      if (address !== undefined) updateData.address = address;
      if (profileImage !== undefined) updateData.profileImage = profileImage;
    }

    const updated = await Client.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    await logActivity('client_updated', req.user.id, updated._id, `Client ${updated.fullName} updated`);
    return successResponse(res, updated, 'Client updated');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/clients/:id
export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return errorResponse(res, 'Client not found', 404);

    await Client.findByIdAndDelete(req.params.id);
    await logActivity('client_deleted', req.user.id, client._id, `Client ${client.fullName} deleted`);
    return successResponse(res, null, 'Client deleted');
  } catch (err) {
    next(err);
  }
};

// GET /api/clients/stats  (admin only)
export const getClientStats = async (req, res, next) => {
  try {
    const stats = await Client.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    return successResponse(res, stats, 'Client stats fetched');
  } catch (err) {
    next(err);
  }
};
