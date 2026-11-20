'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users2,
  FolderKanban,
  CheckSquare,
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  Activity,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApi } from '@/hooks/useApi';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard, SkeletonLine } from '@/components/ui/Skeleton';
import { formatDate, getRelativeTime } from '@/lib/utils';

const COLORS = ['#0A84FF', '#30D158', '#FF9F0A', '#FF453A', '#BF5AF2', '#64D2FF'];

export default function AdminDashboardPage() {
  const { data: response, loading, error, refetch } = useApi('/api/analytics/dashboard');
  const stats = response?.data || {};

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonLine className="w-48 h-6" />
            <SkeletonLine className="w-64 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard className="lg:col-span-2 h-72" />
          <SkeletonCard className="h-72" />
        </div>
      </div>
    );
  }

  // Format client status data for PieChart
  // Backend returns [{_id: 'Active', count: 5}, ...] — convert to [{name, value}]
  const clientStatusData = Array.isArray(stats.clientsByStatus) && stats.clientsByStatus.length > 0
    ? stats.clientsByStatus.map(({ _id, count }) => ({ name: _id, value: count }))
    : stats.clientsByStatus && typeof stats.clientsByStatus === 'object' && !Array.isArray(stats.clientsByStatus)
    ? Object.entries(stats.clientsByStatus).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Lead', value: 12 },
        { name: 'Active', value: 28 },
        { name: 'Inactive', value: 4 },
      ];

  // Format projects data for BarChart
  // Backend returns [{_id: 'Active', count: 5}, ...] — convert to [{name, value}]
  const projectStatusData = Array.isArray(stats.projectsByStatus) && stats.projectsByStatus.length > 0
    ? stats.projectsByStatus.map(({ _id, count }) => ({ name: _id, value: count }))
    : stats.projectsByStatus && typeof stats.projectsByStatus === 'object' && !Array.isArray(stats.projectsByStatus)
    ? Object.entries(stats.projectsByStatus).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Planning', value: 5 },
        { name: 'Active', value: 14 },
        { name: 'On Hold', value: 3 },
        { name: 'Completed', value: 18 },
      ];

  const recentActivities = stats.recentActivities || [];

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of your active clients, projects, and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/clients">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </Button>
          </Link>
          <Link href="/admin/projects">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <FolderKanban className="w-4 h-4" />
              <span>New Project</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={stats.totalClients ?? 0}
          change="+12%"
          trend="up"
          icon={Users2}
          description="from last month"
        />
        <StatCard
          title="Active Projects"
          value={stats.totalProjects ?? 0}
          change="+4"
          trend="up"
          icon={FolderKanban}
          description="currently in flight"
        />
        <StatCard
          title="Open Tasks"
          value={stats.activeTasks ?? 0}
          change="-2"
          trend="down"
          icon={CheckSquare}
          description="pending completion"
        />
        <StatCard
          title="New This Month"
          value={stats.newClientsThisMonth ?? 0}
          change="+18%"
          trend="up"
          icon={Sparkles}
          description="onboarded recently"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Overview BarChart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Projects Overview</CardTitle>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Distribution of projects across lifecycle stages
              </p>
            </div>
            <Link href="/admin/projects" className="text-xs text-[#0A84FF] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#888888" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#888888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                  />
                  <Bar dataKey="value" fill="#0A84FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Clients By Status PieChart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Clients by Status</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Breakdown of lead vs active relationships
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clientStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {clientStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
              {clientStatusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity List & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0A84FF]" />
              <span>Recent Activity</span>
            </CardTitle>
            <span className="text-xs text-gray-400">Latest operations</span>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                No recent activity recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.slice(0, 6).map((act, idx) => (
                  <div
                    key={act._id || idx}
                    className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {act.description || `${act.type} on ${act.targetModel}`}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getRelativeTime(act.createdAt)}
                      </p>
                    </div>
                    {act.targetModel && (
                      <Badge variant="outline" className="text-[10px]">
                        {act.targetModel}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Shortcut Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>System Shortcuts</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Jump straight to core management modules.
            </p>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Link
              href="/admin/clients"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Directory</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              href="/admin/tasks"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Task Boards</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">User Permissions</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Detailed Analytics</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
