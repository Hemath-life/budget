'use client';

import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui';
import {
  ChevronRight,
  DollarSign,
  Palette,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const settingsLinks = [
  {
    name: 'Profile',
    href: '/settings/profile',
    icon: User,
    description: 'View and manage your profile information',
  },
  {
    name: 'General',
    href: '/settings',
    icon: Settings,
    description: 'Manage your account settings and preferences',
  },
  {
    name: 'Currency',
    href: '/settings/currency',
    icon: DollarSign,
    description: 'Set your default currency and exchange rates',
  },
  {
    name: 'Theme',
    href: '/settings/theme',
    icon: Palette,
    description: 'Customize the app appearance and dark mode',
  },
];

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <Card className="lg:col-span-1 h-fit hidden lg:block">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your preferences</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <nav className="space-y-1">
            {settingsLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 text-sm transition-colors border-l-2',
                    isActive
                      ? 'border-primary bg-muted text-foreground'
                      : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              );
            })}
          </nav>
        </CardContent>
      </Card>
      <div className="lg:col-span-3">{children}</div>
    </div>
  );
}
