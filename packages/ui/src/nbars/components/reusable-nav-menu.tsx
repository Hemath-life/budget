import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '#/components/ui/navigation-menu';
import { ThemeSwitch } from '#/common';
import { cn } from '#/lib';
import type { NavLink } from '../top-bars';

interface ReusableNavMenuProps {
  navLinks?: NavLink[];
  showThemeToggle?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const defaultNavLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

export const ReusableNavMenu: React.FC<ReusableNavMenuProps> = ({
  navLinks = defaultNavLinks,
  showThemeToggle = true,
  orientation = 'horizontal',
  className,
}) => {
  return (
    <NavigationMenu orientation={orientation} className={className}>
      <NavigationMenuList
        className={cn(
          'gap-6 space-x-0',
          orientation === 'vertical'
            ? 'flex-col items-start space-y-2 w-full'
            : 'flex-row items-center',
        )}
      >
        {navLinks.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink
              asChild
              className={cn(
                'transition-colors hover:text-foreground/80 text-foreground/60',
                'px-3 py-2 text-sm font-medium rounded-md',
                orientation === 'vertical' ? 'w-full text-left' : '',
                link.className,
              )}
            >
              {link.href.startsWith('http') ? (
                <a
                  href={link.href}
                  target={link.target || '_blank'}
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ) : (
                <Link to={link.href}>{link.label}</Link>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}

        {showThemeToggle && orientation === 'horizontal' && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild tabIndex={-1} className="p-0">
              <ThemeSwitch />
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
