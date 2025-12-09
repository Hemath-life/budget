'use client';

import { cn } from '@/lib/utils';
import { DollarSign, Palette, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const settingsLinks = [
  {
    name: 'Profile',
    href: '/settings/profile',
    icon: User,
  },
  {
    name: 'General',
    href: '/settings/general',
    icon: Settings,
  },
  {
    name: 'Currency',
    href: '/settings/currency',
    icon: DollarSign,
  },
  {
    name: 'Theme',
    href: '/settings/theme',
    icon: Palette,
  },
];

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Sidebar - Main sidebar style */}
      <aside className="hidden lg:block">
        <div className="sticky top-0 rounded-lg border border-sidebar-border bg-sidebar p-4 space-y-4">
          <div className="px-2">
            <p className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
              Settings
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
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2 min-w-max">
          {settingsLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="min-w-0">{children}</main>
    </div>
  );
}
