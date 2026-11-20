import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Client from '../models/Client.js';
import Activity from '../models/Activity.js';
import { successResponse, errorResponse } from '../utils/response.js';

const logActivity = async (type, userId, targetId, description, metadata = {}) => {
  try {
    await Activity.create({ type, userId, targetId, targetModel: 'Task', description, metadata });
  } catch (_) {}
};

// Resolve project IDs for CLIENT role
const getClientProjectIds = async (userId) => {
  const clientRecord = await Client.findOne({ userId });
  if (!clientRecord) return [];
  const projects = await Project.find({ client: clientRecord._id }, '_id');
  return projects.map((p) => p._id);
};

// GET /api/tasks
export const getTasks = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'CLIENT') {
      const projectIds = await getClientProjectIds(req.user.id);
      filter.project = { $in: projectIds };
    } else if (req.query.project) {
      filter.project = req.query.project;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(filter).populate('project', 'title').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    return successResponse(res, tasks, 'Tasks fetched', 200, { total, page, limit });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return errorResponse(res, 'Task not found', 404);

    if (req.user.role === 'CLIENT') {
      const projectIds = await getClientProjectIds(req.user.id);
      if (!projectIds.some((id) => String(id) === String(task.project._id))) {
        return errorResponse(res, 'Forbidden', 403);
      }
    }

    return successResponse(res, task);
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, assignedBy: req.user.id });
    await logActivity('task_created', req.user.id, task._id, `Task ${task.title} created`);
    return successResponse(res, task, 'Task created', 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return errorResponse(res, 'Task not found', 404);

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    await logActivity('task_updated', req.user.id, updated._id, `Task ${updated.title} updated`);
    return successResponse(res, updated, 'Task updated');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return errorResponse(res, 'Task not found', 404);

    await Task.findByIdAndDelete(req.params.id);
    await logActivity('task_deleted', req.user.id, task._id, `Task ${task.title} deleted`);
    return successResponse(res, null, 'Task deleted');
  } catch (err) {
    next(err);
  }
};
