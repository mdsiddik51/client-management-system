'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';

export default function ClientTasksPage() {
  const { success, error: toastError } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    const { data: res, error } = await api.get('/api/tasks');
    if (error) {
      toastError('Error', error);
    } else {
      setTasks(res.data || res || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingId(taskId);
    const { error } = await api.put(`/api/tasks/${taskId}`, { status: newStatus });
    if (error) {
      toastError('Update Failed', error);
    } else {
      success('Status Updated', `Task status set to "${newStatus}".`);
      fetchTasks();
    }
    setUpdatingId(null);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !search ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          My Tasks & Deliverables
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track project milestones, review deliverables, and update task progress.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <SearchInput
          placeholder="Search deliverables..."
          onDebouncedChange={setSearch}
          className="max-w-md"
        />

        <div className="w-40">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Todo', value: 'Todo' },
              { label: 'In Progress', value: 'In Progress' },
              { label: 'Review', value: 'Review' },
              { label: 'Done', value: 'Done' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="You currently don't have any tasks matching your filters."
        />
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status / Action</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{t.title}</div>
                    {t.description && (
                      <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                        {t.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t.project?.title || 'General'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.priority}>{t.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formatDate(t.dueDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <select
                        value={t.status}
                        disabled={updatingId === t._id}
                        onChange={(e) => handleStatusChange(t._id, e.target.value)}
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">In Review</option>
                        <option value="Done">Done</option>
                      </select>
                      <Badge variant={t.status} className="hidden sm:inline-flex">
                        {t.status}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
