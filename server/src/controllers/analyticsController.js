import Client from '../models/Client.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';
import { successResponse } from '../utils/response.js';

// GET /api/analytics/dashboard  (ADMIN only)
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalClients,
      activeClients,
      totalProjects,
      activeTasks,
      clientsByStatus,
      projectsByStatus,
      tasksByStatus,
      newClientsThisMonth,
      newProjectsThisMonth,
      recentActivities,
    ] = await Promise.all([
      Client.countDocuments({}),
      Client.countDocuments({ status: 'Active' }),
      Project.countDocuments({}),
      Task.countDocuments({ status: { $in: ['Todo', 'In Progress', 'Review'] } }),
      Client.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Project.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Client.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Project.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Activity.find({}).sort({ createdAt: -1 }).limit(10),
    ]);

    return successResponse(
      res,
      {
        totalClients,
        activeClients,
        totalProjects,
        activeTasks,
        clientsByStatus,
        projectsByStatus,
        tasksByStatus,
        newClientsThisMonth,
        newProjectsThisMonth,
        recentActivities,
      },
      'Dashboard stats fetched'
    );
  } catch (err) {
    next(err);
  }
};
