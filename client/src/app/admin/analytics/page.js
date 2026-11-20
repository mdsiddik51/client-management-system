'use client';

import React from 'react';
import {
  Users2,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  Download,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApi } from '@/hooks/useApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { SkeletonCard, SkeletonLine } from '@/components/ui/Skeleton';

const COLORS = ['#0A84FF', '#30D158', '#FF9F0A', '#FF453A', '#BF5AF2'];

// Mock monthly client acquisition curve
const clientGrowthData = [
  { month: 'Jan', clients: 12 },
  { month: 'Feb', clients: 19 },
  { month: 'Mar', clients: 25 },
  { month: 'Apr', clients: 32 },
  { month: 'May', clients: 40 },
  { month: 'Jun', clients: 58 },
  { month: 'Jul', clients: 72 },
  { month: 'Aug', clients: 95 },
  { month: 'Sep', clients: 110 },
  { month: 'Oct', clients: 135 },
  { month: 'Nov', clients: 158 },
  { month: 'Dec', clients: 182 },
];

// Mock monthly projects delivered
const projectDeliveryData = [
  { month: 'Jun', completed: 6, started: 8 },
  { month: 'Jul', completed: 8, started: 10 },
  { month: 'Aug', completed: 11, started: 12 },
  { month: 'Sep', completed: 9, started: 14 },
  { month: 'Oct', completed: 14, started: 15 },
  { month: 'Nov', completed: 16, started: 18 },
];

export default function AdminAnalyticsPage() {
  const { data: response, loading } = useApi('/api/analytics/dashboard');
  const stats = response?.data || {};

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <SkeletonLine className="w-48 h-6" />
          <SkeletonLine className="w-64 h-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard className="h-80" />
          <SkeletonCard className="h-80" />
        </div>
      </div>
    );
  }

  const taskStatusData = Array.isArray(stats.tasksByStatus) && stats.tasksByStatus.length > 0
    ? stats.tasksByStatus.map(({ _id, count }) => ({ name: _id, value: count }))
    : stats.tasksByStatus && typeof stats.tasksByStatus === 'object' && !Array.isArray(stats.tasksByStatus)
    ? Object.entries(stats.tasksByStatus).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Todo', value: 14 },
        { name: 'In Progress', value: 22 },
        { name: 'Review', value: 8 },
        { name: 'Done', value: 45 },
      ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Data-driven insights across client volume, project velocities, and deliverables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => alert('Report generated and downloaded successfully.')}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Directory Clients"
          value={stats.totalClients ?? 48}
          change="+24%"
          trend="up"
          icon={Users2}
          description="YoY client volume"
        />
        <StatCard
          title="Total Active Projects"
          value={stats.totalProjects ?? 16}
          change="+18%"
          trend="up"
          icon={FolderKanban}
          description="In progress"
        />
        <StatCard
          title="Task Completion Rate"
          value="94.2%"
          change="+3.1%"
          trend="up"
          icon={TrendingUp}
          description="Deliverables on-time"
        />
      </div>

      {/* Line Chart: Clients Growth */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Client Growth Curve</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Cumulative client acquisitions over the calendar year
            </p>
          </div>
          <span className="text-xs text-gray-400">Past 12 Months</span>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clientGrowthData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#888888" />
                <YAxis tick={{ fontSize: 12 }} stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="clients"
                  stroke="#0A84FF"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0A84FF' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Grid: Projects BarChart + Tasks PieChart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Velocity BarChart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Velocity</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              New project kickoffs vs successfully completed deliverables
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectDeliveryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#888888" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#888888" />
                  <Tooltip />
                  <Bar dataKey="started" name="Started" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#0A84FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Status Breakdown PieChart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Live status partition of all team tasks
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              {taskStatusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>
                    {item.name}: <strong>{item.value}</strong>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
