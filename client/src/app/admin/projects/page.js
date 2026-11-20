'use client';

import React, { useState } from 'react';
import { Plus, Search, FolderKanban, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';

export default function ProjectsPage() {
  const { success: toastSuccess, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch projects
  const { data: response, loading, refetch } = useApi('/api/projects');
  const projects = response?.data || [];

  // Fetch clients for dropdown selector
  const { data: clientsRes, refetch: refetchClients } = useApi('/api/clients');
  const clients = clientsRes?.data || [];

  // Quick client creation state
  const [isQuickClientOpen, setIsQuickClientOpen] = useState(false);
  const [quickClientSubmitting, setQuickClientSubmitting] = useState(false);
  const [quickClientData, setQuickClientData] = useState({
    fullName: '',
    email: '',
    company: '',
    status: 'Active',
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client: '',
    priority: 'Medium',
    status: 'Planning',
    startDate: '',
    endDate: '',
  });

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      client: clients[0]?._id || '',
      priority: 'Medium',
      status: 'Planning',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      client: project.client?._id || project.client || '',
      priority: project.priority || 'Medium',
      status: project.status || 'Planning',
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.client) {
      toastError('Validation', 'Project title and client are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProject) {
        const { error } = await api.put(`/api/projects/${editingProject._id}`, formData);
        if (error) throw new Error(error);
        toastSuccess('Updated', `Project ${formData.title} has been updated.`);
      } else {
        const { error } = await api.post('/api/projects', formData);
        if (error) throw new Error(error);
        toastSuccess('Created', `Project ${formData.title} has been created.`);
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toastError('Operation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickClientSubmit = async (e) => {
    e.preventDefault();
    if (!quickClientData.fullName || !quickClientData.email) {
      toastError('Validation', 'Client full name and email are required.');
      return;
    }
    setQuickClientSubmitting(true);
    try {
      const { data: newClientRes, error } = await api.post('/api/clients', quickClientData);
      if (error) throw new Error(error);
      const createdClient = newClientRes?.data || newClientRes;
      toastSuccess('Client Added', `${quickClientData.fullName} was created and selected.`);
      await refetchClients();
      if (createdClient?._id) {
        setFormData((prev) => ({ ...prev, client: createdClient._id }));
      }
      setIsQuickClientOpen(false);
      setQuickClientData({ fullName: '', email: '', company: '', status: 'Active' });
    } catch (err) {
      toastError('Failed to create client', err.message);
    } finally {
      setQuickClientSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await api.delete(`/api/projects/${deleteTarget._id}`);
      if (error) throw new Error(error);
      toastSuccess('Deleted', `Project ${deleteTarget.title} was removed.`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toastError('Delete Failed', err.message);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track client deliverables, active phases, milestones, and deadlines.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
          >
            <option value="">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
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
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-8 shadow-sm">
          <EmptyState
            title="No projects found"
            description="Create your first client project to organize tasks and deliverables."
            actionLabel="New Project"
            onAction={handleOpenCreate}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const clientName = project.client?.fullName || project.client?.name || 'Client';
            return (
              <div
                key={project._id}
                className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-apple transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold text-[#0A84FF] tracking-wide uppercase">
                      {clientName}
                    </span>
                    <Badge variant={project.status}>{project.status}</Badge>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Priority: <strong className="text-gray-700 dark:text-gray-300">{project.priority}</strong></span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(project)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#0A84FF] hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(project)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Title *"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Website Redesign & Brand Sprint"
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Client *
              </label>
              <button
                type="button"
                onClick={() => setIsQuickClientOpen(true)}
                className="text-xs text-[#0A84FF] hover:underline flex items-center gap-1 font-medium"
              >
                <Plus className="w-3 h-3" /> Add New Client
              </button>
            </div>
            <select
              required
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="">Select a Client...</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.fullName || c.name} ({c.company || 'No Company'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Scope, key deliverables, and client objectives..."
              className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="Target End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Add Client Modal */}
      <Modal
        isOpen={isQuickClientOpen}
        onClose={() => setIsQuickClientOpen(false)}
        title="Add New Client"
      >
        <form onSubmit={handleQuickClientSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            required
            value={quickClientData.fullName}
            onChange={(e) =>
              setQuickClientData({ ...quickClientData, fullName: e.target.value })
            }
            placeholder="Jane Doe"
          />
          <Input
            label="Email Address *"
            type="email"
            required
            value={quickClientData.email}
            onChange={(e) =>
              setQuickClientData({ ...quickClientData, email: e.target.value })
            }
            placeholder="jane@company.com"
          />
          <Input
            label="Company"
            value={quickClientData.company}
            onChange={(e) =>
              setQuickClientData({ ...quickClientData, company: e.target.value })
            }
            placeholder="Acme Corp"
          />
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={quickClientData.status}
              onChange={(e) =>
                setQuickClientData({ ...quickClientData, status: e.target.value })
              }
              className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Lead">Lead</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsQuickClientOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={quickClientSubmitting}>
              Save & Select Client
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Project"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete project{' '}
            <strong className="text-gray-900 dark:text-white">{deleteTarget?.title}</strong>? All
            associated tasks may be archived or removed.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
