import { getDBStatus } from '../config/db.js';

import clientRoutes from './clients.js';
import projectRoutes from './projects.js';
import taskRoutes from './tasks.js';
import userRoutes from './users.js';
import uploadRoutes from './upload.js';
import analyticsRoutes from './analytics.js';
import notificationRoutes from './notifications.js';

export const setupRoutes = (app) => {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: getDBStatus(), timestamp: new Date() });
  });

  // Feature routes
  app.use('/api/clients', clientRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/notifications', notificationRoutes);
};
