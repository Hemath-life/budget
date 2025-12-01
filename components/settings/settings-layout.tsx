'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Settings,
  Palette,
  DollarSign,
  Bell,
  User,
  Shield,
  ChevronRight,
} from 'lucide-react';

const settingsLinks = [
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
      <Card className="lg:col-span-1 h-fit">
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
                      : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
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
