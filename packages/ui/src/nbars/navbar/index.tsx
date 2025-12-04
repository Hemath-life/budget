import { Search } from '#/common';
import { Button } from '#/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';
import { ProfileDropdown } from '#/forms/profile-dropdown';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { type ReactNode, useMemo } from 'react';
import type { SidebarData } from '../../layout/types';
import { cn } from '../../lib/utils';
import { Header } from './header';
import { TopNav } from './top-nav';

interface NavLinkConfig {
  title: string;
  href: string;
  disabled?: boolean;
}

interface HeaderNavProps {
  fixed?: boolean;
  className?: string;
  variant?: 'search-first' | 'title-first' | 'minimal';
  logout?: () => void;
  extraActions?: ReactNode;
  navLinks?: NavLinkConfig[];
  sidebarData?: SidebarData;
  searchPlaceholder?: string;
  showNav?: boolean;
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
    extraActions,
    navLinks,
    sidebarData,
    searchPlaceholder,
    showNav = true,
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
      <div className="flex w-full flex-col gap-3">
        {!isMinimal ? (
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
            <div className="flex w-full justify-center md:flex-1">
              <Search
                className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2"
                placeholder={searchPlaceholder}
              />
            </div>
            <div
              className={cn(
                'flex items-center justify-center gap-4 md:ml-auto md:justify-end',
                className,
              )}
            >
              <ThemeToggle />
              <ProfileDropdown logout={logout} />
              {extraActions}
            </div>
          </div>
        ) : (
          <div className={cn('ml-auto flex items-center gap-4', className)}>
            <ThemeToggle />
            <ProfileDropdown logout={logout} />
            {extraActions}
          </div>
        )}

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
      </div>
    </Header>
  );
};

const ThemeToggle = () => {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
