'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useDeleteUser, useUpdateUser } from '@/lib/hooks';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  Separator,
} from '@repo/ui/components/ui';
import { AlertDialog } from '@repo/ui/dialogs';
import {
  Check,
  ChevronRight,
  Download,
  LogOut,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function getInitials(name?: string | null, email?: string): string {
  if (name) {
    const parts = name.split(' ');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return 'U';
}

export function ProfileSettings() {
  const { user, logout, setUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '';
  const initials = getInitials(user?.name, user?.email);

  const handleSaveName = async () => {
    if (!editName.trim()) return;

    try {
      const updatedUser = await updateUser.mutateAsync({
        name: editName.trim(),
      });
      // Update the local user state
      if (user) {
        setUser({ ...user, name: updatedUser.name });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update name:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser.mutateAsync();
      // Clear auth and redirect to login
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || '');
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile Card */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatar || undefined} alt={displayName} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate">{displayName}</h2>
            <p className="text-sm text-muted-foreground truncate">
              {displayEmail}
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Google
            </span>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b">
          <h3 className="font-medium">Account</h3>
        </div>

        {/* Name */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Name</p>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8 max-w-[200px]"
                  disabled={updateUser.isPending}
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleSaveName}
                  disabled={updateUser.isPending || !editName.trim()}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleCancelEdit}
                  disabled={updateUser.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="font-medium truncate">{displayName}</p>
            )}
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => {
                setEditName(user?.name || '');
                setIsEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Separator />

        {/* Email */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium truncate">{displayEmail}</p>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            Managed by Google
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b">
          <h3 className="font-medium">Actions</h3>
        </div>

        <Link
          href="/export"
          className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Download className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-muted-foreground">
                Download all your data
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Separator />

        <button
          onClick={logout}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center">
              <LogOut className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-sm text-muted-foreground">
                Log out of your account
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/20 bg-card">
        <div className="p-4 border-b border-red-500/20">
          <h3 className="font-medium text-red-500">Danger Zone</h3>
        </div>

        <button
          onClick={() => setShowDeleteDialog(true)}
          className="w-full flex items-center justify-between p-4 hover:bg-red-500/5 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trash2 className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="font-medium text-red-500">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and data
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-red-500" />
        </button>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete account?"
        description="This will permanently delete your account and all your data including transactions, budgets, categories, goals, and settings. This action cannot be undone."
        variant="delete"
        isLoading={deleteUser.isPending}
        confirmText={deleteUser.isPending ? 'Deleting...' : 'Delete Account'}
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
