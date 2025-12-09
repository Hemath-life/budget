import { Bell, LogOut, Moon, MoreVertical, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { type ComponentProps, type ReactNode, useMemo } from 'react';
import type { SidebarData } from '../../layout/types';
import { cn } from '../../lib/utils';
import { Header } from './header';
import { TopNav } from './top-nav';
import { Search } from '#/common';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';
import { ProfileDropdown } from '#/forms/profile-dropdown';

interface NavLinkConfig {
  title: string;
  href: string;
  disabled?: boolean;
}

interface ReminderItem {
  id: string | number;
  title: string;
  description?: string;
  href?: string;
}

interface ReminderDropdownProps {
  count?: number;
  items?: ReminderItem[];
  emptyLabel?: string;
  viewAll?: {
    href: string;
    label?: string;
  };
  triggerLabel?: string;
}

interface UserProfile {
  name?: string | null;
  email?: string;
  avatar?: string | null;
}

interface HeaderNavProps {
  fixed?: boolean;
  className?: string;
  variant?: 'search-first' | 'title-first' | 'minimal';
  logout?: () => void;
  user?: UserProfile | null;
  extraActions?: ReactNode;
  navLinks?: NavLinkConfig[];
  sidebarData?: SidebarData;
  searchPlaceholder?: string;
  showNav?: boolean;
  badge?: {
    label: string;
    variant?: ComponentProps<typeof Badge>['variant'];
    className?: string;
  };
  reminderDropdown?: ReminderDropdownProps;
}

export const HeaderNav = (
  props: HeaderNavProps = {
    fixed: false,
    className: '',
    variant: 'search-first',
  },
) => {
  const {
    className,
    variant,
    fixed,
    logout,
    user,
    extraActions,
    navLinks,
    sidebarData,
    searchPlaceholder,
    showNav = true,
    badge,
    reminderDropdown,
  } = { ...props };

  const pathname = usePathname();

  const computedNavLinks = useMemo(() => {
    if (!showNav) return [];
    const explicitLinks = navLinks?.length
      ? navLinks
      : deriveLinksFromSidebar(sidebarData);

    if (!explicitLinks?.length) return [];

    return explicitLinks.map((link) => ({
      ...link,
      href: normalizeHref(link.href),
      isActive: isLinkActive(pathname, link.href),
    }));
  }, [navLinks, sidebarData, pathname, showNav]);

  const navItems = computedNavLinks.filter(Boolean);
  const showTopNav = showNav && navItems.length > 0;
  const isMinimal = variant === 'minimal';

  return (
    <Header fixed={fixed}>
      <div className="flex w-full flex-1 items-center gap-2 sm:gap-3 min-w-0">
        {!isMinimal ? (
          <>
            {/* Search - takes remaining space */}
            <div className="flex-1 min-w-0">
              <Search className="w-full" placeholder={searchPlaceholder} />
            </div>
            {/* Desktop Actions - hidden on mobile */}
            <div className={cn('hidden sm:flex items-center gap-3', className)}>
              <ThemeToggle />
              {badge ? (
                <Badge
                  variant={badge.variant ?? 'outline'}
                  className={badge.className}
                >
                  {badge.label}
                </Badge>
              ) : null}
              {reminderDropdown ? (
                <ReminderDropdown {...reminderDropdown} />
              ) : null}
              <ProfileDropdown logout={logout} user={user} />
              {extraActions}
            </div>
            {/* Mobile Actions - More menu */}
            <MobileActionsMenu
              logout={logout}
              reminderDropdown={reminderDropdown}
            />
          </>
        ) : (
          <div className={cn('ml-auto flex items-center gap-4', className)}>
            <ThemeToggle />
            {badge ? (
              <Badge
                variant={badge.variant ?? 'outline'}
                className={cn('hidden sm:flex', badge.className)}
              >
                {badge.label}
              </Badge>
            ) : null}
            {reminderDropdown ? (
              <ReminderDropdown {...reminderDropdown} />
            ) : null}
            <ProfileDropdown logout={logout} user={user} />
            {extraActions}
          </div>
        )}
      </div>
      {showTopNav ? (
        <TopNav
          links={navItems}
          className={cn(
            variant === 'search-first'
              ? 'justify-center md:justify-start'
              : 'justify-start',
          )}
        />
      ) : null}
    </Header>
  );
};

// Mobile actions menu - combines theme, notifications, and profile into one dropdown
const MobileActionsMenu = ({
  logout,
  reminderDropdown,
}: {
  logout?: () => void;
  reminderDropdown?: ReminderDropdownProps;
}) => {
  const { theme, setTheme } = useTheme();
  const reminderCount = reminderDropdown?.count || 0;

  return (
    <div className="flex sm:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative size-8">
            <MoreVertical className="h-4 w-4" />
            {reminderCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {reminderCount > 9 ? '9+' : reminderCount}
              </span>
            ) : null}
            <span className="sr-only">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Theme options */}
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <Sun className="mr-2 h-4 w-4" />
            Light theme
            {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <Moon className="mr-2 h-4 w-4" />
            Dark theme
            {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Reminders */}
          {reminderDropdown &&
          reminderDropdown.items &&
          reminderDropdown.items.length > 0 ? (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Reminders ({reminderCount})
              </div>
              {reminderDropdown.items.slice(0, 3).map((item) => (
                <DropdownMenuItem key={item.id} asChild={!!item.href}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex flex-col items-start gap-0.5"
                    >
                      <span className="text-sm">{item.title}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-sm">{item.title}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </div>
                  )}
                </DropdownMenuItem>
              ))}
              {reminderDropdown.viewAll && (
                <DropdownMenuItem asChild>
                  <Link
                    href={reminderDropdown.viewAll.href}
                    className="text-sm text-primary"
                  >
                    {reminderDropdown.viewAll.label ?? 'View all reminders'}
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
            </>
          ) : reminderDropdown ? (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Reminders
              </div>
              <div className="px-2 py-2 text-sm text-muted-foreground">
                {reminderDropdown.emptyLabel ?? 'No reminders'}
              </div>
              <DropdownMenuSeparator />
            </>
          ) : null}
          {/* Profile actions */}
          <DropdownMenuItem asChild>
            <Link href="/settings">Profile & Settings</Link>
          </DropdownMenuItem>
          {logout && (
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ThemeToggle = () => {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 sm:size-9">
          <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const deriveLinksFromSidebar = (sidebarData?: SidebarData): NavLinkConfig[] => {
  if (!sidebarData) return [];
  const links: NavLinkConfig[] = [];

  sidebarData.navGroups.forEach((group) => {
    group.items.forEach((item) => {
      if ('url' in item && item.url) {
        links.push({ title: item.title, href: item.url });
      }

      if ('items' in item && item.items) {
        item.items.forEach((subItem) => {
          if ('url' in subItem && subItem.url) {
            links.push({ title: subItem.title, href: subItem.url });
          }
        });
      }
    });
  });

  return links;
};

const normalizeHref = (href: string) =>
  href?.startsWith('/') ? href : `/${href ?? ''}`;

const isLinkActive = (pathname: string | null, href: string) => {
  if (!pathname) return false;
  const normalized = normalizeHref(href);
  if (normalized === '/') return pathname === '/';
  return pathname === normalized || pathname.startsWith(`${normalized}/`);
};

const ReminderDropdown = ({
  count = 0,
  items = [],
  emptyLabel = 'No reminders',
  viewAll,
  triggerLabel = 'Reminders',
}: ReminderDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="relative size-8 sm:size-9"
        aria-label={triggerLabel}
      >
        <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        {count > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            {count > 9 ? '9+' : count}
          </span>
        ) : null}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-80">
      {items.length === 0 ? (
        <div className="p-4 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        items.map((item) => (
          <DropdownMenuItem key={item.id} asChild={!!item.href}>
            {item.href ? (
              <Link
                href={item.href}
                className="flex flex-col items-start gap-1 p-3"
              >
                <span className="font-medium">{item.title}</span>
                {item.description ? (
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                ) : null}
              </Link>
            ) : (
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">{item.title}</span>
                {item.description ? (
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                ) : null}
              </div>
            )}
          </DropdownMenuItem>
        ))
      )}
      {viewAll ? (
        <DropdownMenuItem asChild>
          <Link
            href={viewAll.href}
            className="text-center text-sm text-primary"
          >
            {viewAll.label ?? 'View all'}
          </Link>
        </DropdownMenuItem>
      ) : null}
    </DropdownMenuContent>
  </DropdownMenu>
);
