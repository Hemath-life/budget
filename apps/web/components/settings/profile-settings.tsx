'use client';

import { useAuth } from '@/components/providers/auth-provider';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  Input,
  Label,
} from '@repo/ui/components/ui';
import { Download, LogOut, Mail, Shield, Trash2, User } from 'lucide-react';
import Link from 'next/link';

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
  const { user, logout } = useAuth();

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '';
  const initials = getInitials(user?.name, user?.email);

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
              <Input
                id="name"
                value={displayName}
                disabled
                className="bg-muted/50"
              />
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
            Your account information is managed by Google. To update your name
            or email, please visit your Google account settings.
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

        <Card className="opacity-50 cursor-not-allowed">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
