'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Camera,
  Mail,
  Phone,
  Building,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/components/ui/Toast';

export default function ClientProfilePage() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [clientId, setClientId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadClientData() {
      setLoading(true);
      // Fetch client record for this user
      const { data: res } = await api.get('/api/clients');
      const clientsList = res?.data || res || [];
      const myClient = clientsList[0]; // Client users get their own client record

      if (myClient) {
        setClientId(myClient._id);
        setName(myClient.fullName || user?.name || '');
        setEmail(myClient.email || user?.email || '');
        setPhone(myClient.phone || '');
        setCompany(myClient.company || '');
        setAvatarUrl(myClient.profileImage?.url || user?.image || '');
      } else {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setAvatarUrl(user?.image || '');
      }
      setLoading(false);
    }

    loadClientData();
  }, [user]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Invalid File', 'Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    const { data: uploadRes, error: uploadErr } = await api.upload('/api/upload/image', formData);

    if (uploadErr) {
      toastError('Upload Failed', uploadErr);
      setUploading(false);
      return;
    }

    const uploadedUrl = uploadRes?.data?.url || uploadRes?.url;
    setAvatarUrl(uploadedUrl);

    // Save to client record if exists
    if (clientId) {
      await api.put(`/api/clients/${clientId}`, {
        profileImage: { url: uploadedUrl, publicId: uploadRes?.data?.publicId },
      });
    }

    // Save to user profile
    await api.patch('/api/users/profile', { image: uploadedUrl });

    success('Avatar Updated', 'Profile photo uploaded successfully.');
    setUploading(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (clientId) {
      const { error: clientErr } = await api.put(`/api/clients/${clientId}`, {
        fullName: name,
        phone,
        company,
      });
      if (clientErr) {
        toastError('Failed to update details', clientErr);
        setSaving(false);
        return;
      }
    }

    const { error: userErr } = await api.patch('/api/users/profile', { name });
    if (userErr) {
      toastError('Failed to update name', userErr);
    } else {
      success('Profile Saved', 'Your contact information has been updated.');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Client Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal information, company profile, and avatar photo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="relative group">
              <Avatar name={name || 'Client'} src={avatarUrl} size="xl" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Profile Avatar
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                PNG, JPG, or WebP up to 5MB.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-1.5"
                loading={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New Photo</span>
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
              <Input
                label="Email Address"
                value={email}
                disabled
                helper="Primary account address cannot be modified directly"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
              <Input
                label="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Organization or brand name"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button type="submit" loading={saving} size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
