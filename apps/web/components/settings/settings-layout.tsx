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
    href: '/settings',
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

  // Get current page title
  const currentPage = settingsLinks.find((link) => link.href === pathname);
  const pageTitle = currentPage?.name || 'Settings';

  return (
    <div className="space-y-6">
      {/* Header with Tab Navigation */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
            {settingsLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30',
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
