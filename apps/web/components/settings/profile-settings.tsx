'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useDeleteUser, useUpdateUser } from '@/lib/hooks';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
} from '@repo/ui/components/ui';
import { AlertDialog } from '@repo/ui/dialogs';
import {
  Check,
  Download,
  LogOut,
  Mail,
  Pencil,
  Shield,
  Trash2,
  User,
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
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="h-32 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

        {/* Profile Info */}
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={user?.avatar || undefined} alt={displayName} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Name and Email */}
      <div className="pt-14 px-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground">{displayEmail}</p>
          </div>
          <Badge
            variant="secondary"
            className="gap-1.5 px-3 py-1.5 w-fit text-sm"
          >
            <Shield className="h-3.5 w-3.5" />
            Google Account
          </Badge>
        </div>
      </div>

      {/* Account Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <User className="h-4 w-4" />
            Account Details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">
                Full Name
              </Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={isEditing ? editName : displayName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={!isEditing || updateUser.isPending}
                  className={isEditing ? '' : 'bg-muted/50'}
                />
                {isEditing ? (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleSaveName}
                      disabled={updateUser.isPending || !editName.trim()}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      disabled={updateUser.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditName(user?.name || '');
                      setIsEditing(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={displayEmail}
                  disabled
                  className="bg-muted/50 pl-9"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Click the pencil icon to edit your display name. Email is managed by
            your sign-in provider.
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/export">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Download className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">
                  Download your data
                </p>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={logout}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <LogOut className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-sm text-muted-foreground">
                Log out of your account
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer hover:border-red-500/50"
          onClick={() => setShowDeleteDialog(true)}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete account
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Are you absolutely sure?"
        description="This will permanently delete your account and remove all your data including transactions, budgets, categories, goals, and settings. This action cannot be undone."
        variant="delete"
        isLoading={deleteUser.isPending}
        confirmText={deleteUser.isPending ? 'Deleting...' : 'Delete Account'}
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
