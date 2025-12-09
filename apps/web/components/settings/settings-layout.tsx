'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@repo/ui/components/ui';
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
    description: 'Your personal info',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    name: 'General',
    href: '/settings',
    icon: Settings,
    description: 'App preferences',
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
  },
  {
    name: 'Currency',
    href: '/settings/currency',
    icon: DollarSign,
    description: 'Currency & format',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    name: 'Theme',
    href: '/settings/theme',
    icon: Palette,
    description: 'Appearance',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-2">
          <div className="px-3 mb-4">
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your preferences
            </p>
          </div>

          <nav className="space-y-1">
            {settingsLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200',
                    isActive ? 'bg-muted shadow-sm' : 'hover:bg-muted/50',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                      isActive
                        ? link.bgColor
                        : 'bg-muted group-hover:' + link.bgColor,
                    )}
                  >
                    <link.icon
                      className={cn(
                        'h-5 w-5',
                        isActive
                          ? link.color
                          : 'text-muted-foreground group-hover:' + link.color,
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium truncate',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground',
                      )}
                    >
                      {link.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {link.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isActive
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground/50',
                      'group-hover:translate-x-0.5',
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Card>
          <CardContent className="p-2">
            <div className="grid grid-cols-4 gap-1">
              {settingsLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-lg p-3 text-center transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <main className="min-w-0">{children}</main>
    </div>
  );
}
