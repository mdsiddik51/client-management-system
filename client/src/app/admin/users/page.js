'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Trash2,
  UserCheck,
  Calendar,
  Mail,
  Shield,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const { success, error: toastError } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modals
  const [roleModalTarget, setRoleModalTarget] = useState(null);
  const [newRole, setNewRole] = useState('CLIENT');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: res, error } = await api.get('/api/users');
    if (error) {
      toastError('Failed to load users', error);
    } else {
      setUsers(res.data || res || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!roleModalTarget) return;
    setSubmitting(true);

    const { error } = await api.patch(`/api/users/${roleModalTarget._id || roleModalTarget.id}/role`, {
      role: newRole,
    });

    if (error) {
      toastError('Failed to update role', error);
    } else {
      success('Role Updated', `${roleModalTarget.name}'s role changed to ${newRole}.`);
      setRoleModalTarget(null);
      fetchUsers();
    }
    setSubmitting(false);
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);

    const { error } = await api.delete(`/api/users/${deleteTarget._id || deleteTarget.id}`);
    if (error) {
      toastError('Failed to delete user', error);
    } else {
      success('User Removed', 'User account successfully deleted.');
      setDeleteTarget(null);
      fetchUsers();
    }
    setSubmitting(false);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Users & Permissions
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review system accounts, grant administrator privileges, or revoke access.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <SearchInput
          placeholder="Search by name or email..."
          onDebouncedChange={setSearch}
          className="max-w-md"
        />

        <div className="w-40">
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { label: 'All Roles', value: '' },
              { label: 'ADMIN', value: 'ADMIN' },
              { label: 'CLIENT', value: 'CLIENT' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={5} cols={4} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No users found"
          description="Try clearing your search query or role filter."
        />
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u._id || u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} src={u.image} size="sm" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.role}>{u.role || 'CLIENT'}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500">{formatDate(u.createdAt)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setRoleModalTarget(u);
                          setNewRole(u.role || 'CLIENT');
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#0A84FF] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        title="Change role"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Role Change Modal */}
      <Modal
        isOpen={!!roleModalTarget}
        onClose={() => setRoleModalTarget(null)}
        title="Change User Role"
        size="sm"
      >
        <form onSubmit={handleUpdateRole} className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Select access privilege level for{' '}
            <strong className="text-gray-900 dark:text-white">{roleModalTarget?.name}</strong>:
          </p>

          <Select
            label="System Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            options={[
              { label: 'ADMIN — Full system access & management', value: 'ADMIN' },
              { label: 'CLIENT — Portal & assigned projects only', value: 'CLIENT' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" type="button" onClick={() => setRoleModalTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Update Role
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{deleteTarget?.name}</strong>?
            This will terminate their session and remove their login credentials.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={submitting} onClick={handleDeleteUser}>
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
