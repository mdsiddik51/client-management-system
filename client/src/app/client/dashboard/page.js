'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  CheckSquare,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SkeletonCard, SkeletonLine } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const { data: projData, loading: projLoading } = useApi('/api/projects');
  const { data: taskData, loading: taskLoading } = useApi('/api/tasks');

  const loading = projLoading || taskLoading;
  const projects = projData?.data || projData || [];
  const tasks = taskData?.data || taskData || [];

  const completedTasks = tasks.filter((t) => t.status === 'Done');
  const pendingTasks = tasks.filter((t) => t.status !== 'Done' && t.status !== 'Cancelled');
  const upcomingDeadlines = [...tasks]
    .filter((t) => t.dueDate && t.status !== 'Done')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLine className="w-64 h-8" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-200/50 dark:border-blue-900/30">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0A84FF] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Client Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Welcome back, {user?.name || 'Partner'}!
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
          Here is a real-time overview of your active projects, deliverables, and upcoming milestones.
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Projects"
          value={projects.length}
          icon={FolderKanban}
          description="Commissioned deliverables"
        />
        <StatCard
          title="Open Tasks"
          value={pendingTasks.length}
          icon={CheckSquare}
          description="In review or active"
        />
        <StatCard
          title="Completed Deliverables"
          value={completedTasks.length}
          trend="up"
          icon={Sparkles}
          description="Successfully completed"
        />
      </div>

      {/* Grid: Active Projects + Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#0A84FF]" />
              <span>My Projects</span>
            </CardTitle>
            <Link href="/client/projects" className="text-xs text-[#0A84FF] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">No projects assigned yet.</p>
            ) : (
              projects.slice(0, 3).map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {p.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Target: {formatDate(p.endDate)}
                    </p>
                  </div>
                  <Badge variant={p.status}>{p.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0A84FF]" />
              <span>Upcoming Milestones</span>
            </CardTitle>
            <Link href="/client/tasks" className="text-xs text-[#0A84FF] hover:underline flex items-center gap-1">
              All tasks <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">No upcoming deadlines.</p>
            ) : (
              upcomingDeadlines.map((t) => (
                <div
                  key={t._id}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {t.title}
                    </h4>
                    <span className="text-xs text-red-500 font-medium">
                      Due {formatDate(t.dueDate)}
                    </span>
                  </div>
                  <Badge variant={t.priority}>{t.priority}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
