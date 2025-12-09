'use client';

import { useAuth } from '@/components/providers/auth-provider';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from '@repo/ui/components/ui';
import { Camera, Mail, Shield, User } from 'lucide-react';

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
  const { user } = useAuth();

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '';
  const initials = getInitials(user?.name, user?.email);

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your personal information and account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user?.avatar || undefined}
                  alt={displayName}
                />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                disabled
                title="Photo upload coming soon"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            {/* User Info */}
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">{displayName}</h3>
              <p className="text-muted-foreground">{displayEmail}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Google Account
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
          <CardDescription>
            Your account details linked to this profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name Field */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="name"
              value={displayName}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Name is managed by your Google account
            </p>
          </div>

          <Separator />

          {/* Email Field */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={displayEmail}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email is managed by your Google account
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Actions</CardTitle>
          <CardDescription>Manage your account and data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-muted-foreground">
                Download all your financial data
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="/export">Export</a>
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" disabled>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
