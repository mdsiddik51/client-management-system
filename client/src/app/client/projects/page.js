'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Calendar,
  Clock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';

export default function ClientProjectsPage() {
  const { data: res, loading } = useApi('/api/projects');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const projects = res?.data || res || [];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          My Projects
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review the progress, timelines, and milestones of your ongoing projects.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <SearchInput
          placeholder="Search projects..."
          onDebouncedChange={setSearch}
          className="max-w-md"
        />

        <div className="w-40">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Planning', value: 'Planning' },
              { label: 'Active', value: 'Active' },
              { label: 'On Hold', value: 'On Hold' },
              { label: 'Completed', value: 'Completed' },
            ]}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard className="h-56" />
          <SkeletonCard className="h-56" />
          <SkeletonCard className="h-56" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="You currently don't have any projects matching your filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => {
            const isCompleted = p.status === 'Completed';
            const progress = isCompleted ? 100 : p.status === 'Active' ? 65 : p.status === 'Planning' ? 25 : 50;

            return (
              <Card key={p._id} className="flex flex-col justify-between hover:shadow-apple transition-all duration-300">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={p.status}>{p.status}</Badge>
                    <span className="text-xs font-medium text-gray-400">
                      Priority: {p.priority}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {p.description || 'Deliverables and scope tracking active.'}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-2">
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium mb-1.5">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full bg-[#0A84FF] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      End: {formatDate(p.endDate)}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Delivered
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
