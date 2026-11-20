import Project from '../models/Project.js';
import Client from '../models/Client.js';
import Activity from '../models/Activity.js';
import { successResponse, errorResponse } from '../utils/response.js';

const logActivity = async (type, userId, targetId, description, metadata = {}) => {
  try {
    await Activity.create({ type, userId, targetId, targetModel: 'Project', description, metadata });
  } catch (_) {}
};

// GET /api/projects
export const getProjects = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'CLIENT') {
      const clientRecord = await Client.findOne({ userId: req.user.id });
      if (!clientRecord) return successResponse(res, [], 'No projects found', 200, { total: 0 });
      filter.client = clientRecord._id;
    } else if (req.query.client) {
      filter.client = req.query.client;
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

    const [projects, total] = await Promise.all([
      Project.find(filter).populate('client', 'fullName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ]);

    return successResponse(res, projects, 'Projects fetched', 200, { total, page, limit });
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('client', 'fullName email userId');
    if (!project) return errorResponse(res, 'Project not found', 404);

    if (req.user.role === 'CLIENT' && String(project.client?.userId) !== String(req.user.id)) {
      return errorResponse(res, 'Forbidden', 403);
    }

    return successResponse(res, project);
  } catch (err) {
    next(err);
  }
};

// POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    await logActivity('project_created', req.user.id, project._id, `Project ${project.title} created`);
    return successResponse(res, project, 'Project created', 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return errorResponse(res, 'Project not found', 404);

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    await logActivity('project_updated', req.user.id, updated._id, `Project ${updated.title} updated`);
    return successResponse(res, updated, 'Project updated');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return errorResponse(res, 'Project not found', 404);

    await Project.findByIdAndDelete(req.params.id);
    await logActivity('project_deleted', req.user.id, project._id, `Project ${project.title} deleted`);
    return successResponse(res, null, 'Project deleted');
  } catch (err) {
    next(err);
  }
};
