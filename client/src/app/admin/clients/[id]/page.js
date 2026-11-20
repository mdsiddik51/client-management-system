'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  FolderKanban,
  CheckSquare,
  Clock,
  Edit2,
  Trash2,
  Plus,
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { SkeletonCard, SkeletonLine } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id;
  const { success: toastSuccess, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'projects' | 'tasks' | 'notes'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  // Fetch client details
  const { data: clientRes, loading, refetch } = useApi(`/api/clients/${clientId}`);
  const client = clientRes?.data || null;

  // Fetch client projects
  const { data: projectsRes } = useApi('/api/projects');
  const allProjects = projectsRes?.data || [];
  const clientProjects = allProjects.filter(
    (p) => String(p.client?._id || p.client) === String(clientId)
  );

  // Fetch client tasks
  const { data: tasksRes } = useApi('/api/tasks');
  const allTasks = tasksRes?.data || [];
  const clientTasks = allTasks.filter(
    (t) =>
      clientProjects.some((p) => String(p._id) === String(t.project?._id || t.project)) ||
      String(t.client) === String(clientId)
  );

  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    status: 'Active',
    notes: '',
  });

  const handleOpenEdit = () => {
    if (!client) return;
    setEditFormData({
      fullName: client.fullName || client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      industry: client.industry || 'Technology',
      status: client.status || 'Active',
      notes: client.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { error } = await api.put(`/api/clients/${clientId}`, editFormData);
      if (error) throw new Error(error);
      toastSuccess('Updated', 'Client details have been refreshed.');
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      toastError('Update Failed', err.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const combinedNotes = client.notes
        ? `${client.notes}\n[${new Date().toLocaleDateString()}]: ${newNote}`
        : `[${new Date().toLocaleDateString()}]: ${newNote}`;

      const { error } = await api.put(`/api/clients/${clientId}`, {
        notes: combinedNotes,
      });

      if (error) throw new Error(error);
      toastSuccess('Note Added', 'Internal note recorded.');
      setNewNote('');
      setIsNoteModalOpen(false);
      refetch();
    } catch (err) {
      toastError('Failed to add note', err.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLine className="w-32 h-6" />
        <SkeletonCard className="h-40" />
        <SkeletonCard className="h-64" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-base text-gray-500">Client record not found.</p>
        <Link href="/admin/clients">
          <Button variant="outline">Back to Clients</Button>
        </Link>
      </div>
    );
  }

  const clientName = client.fullName || client.name || 'Unnamed Client';

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Clients
        </Link>
      </div>

      {/* Hero Profile Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Avatar
            name={clientName}
            src={client.profileImage?.url || client.avatar?.url}
            size="lg"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {clientName}
              </h1>
              <Badge variant={client.status}>{client.status}</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span>{client.company || 'No Company'}</span>
              <span>•</span>
              <span>{client.industry || 'General'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleOpenEdit} className="gap-1.5">
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Button>
          <Button size="sm" onClick={() => setIsNoteModalOpen(true)} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 flex items-center gap-8 text-sm font-semibold">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'projects', label: `Projects (${clientProjects.length})` },
          { key: 'tasks', label: `Tasks (${clientTasks.length})` },
          { key: 'notes', label: 'Notes & Timeline' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[#0A84FF] text-[#0A84FF]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> Email
                </span>
                <a href={`mailto:${client.email}`} className="font-medium text-[#0A84FF] hover:underline">
                  {client.email}
                </a>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> Phone
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {client.phone || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" /> Created
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDate(client.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {client.notes ? (
                <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  {client.notes}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No notes recorded yet for this client.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {clientProjects.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500 text-sm">
                No active projects for this client.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientProjects.map((proj) => (
                <Card key={proj._id} className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {proj.title}
                    </h3>
                    <Badge variant={proj.status}>{proj.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                    {proj.description || 'No description provided.'}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                    <span>Priority: <strong className="text-gray-700 dark:text-gray-300">{proj.priority}</strong></span>
                    <span>{formatDate(proj.createdAt)}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {clientTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500 text-sm">
                No tasks linked to this client.
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
              {clientTasks.map((t) => (
                <div key={t._id} className="p-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{t.title}</p>
                      <p className="text-xs text-gray-500">{t.project?.title || 'Project'}</p>
                    </div>
                  </div>
                  <Badge variant={t.status}>{t.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Notes */}
      {activeTab === 'notes' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Client Notes & Activity Log</CardTitle>
              <Button size="sm" onClick={() => setIsNoteModalOpen(true)}>
                Add Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
              {client.notes || 'No notes currently stored.'}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Client Details"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Full Name *"
            required
            value={editFormData.fullName}
            onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email *"
              type="email"
              required
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            />
            <Input
              label="Phone"
              value={editFormData.phone}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company"
              value={editFormData.company}
              onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
            />
            <Input
              label="Industry"
              value={editFormData.industry}
              onChange={(e) => setEditFormData({ ...editFormData, industry: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={editFormData.status}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Lead">Lead</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Record Note or Interaction"
      >
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Note or Meeting Summary
            </label>
            <textarea
              rows={4}
              required
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="e.g. Conducted discovery call, discussed quarterly deliverables..."
              className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="ghost" type="button" onClick={() => setIsNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Record Note</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
