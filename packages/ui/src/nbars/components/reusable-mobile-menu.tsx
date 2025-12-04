import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '#/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '#/components/ui/sheet';
import { Menu, ArrowUpRight, ChevronRight } from 'lucide-react';
import { ThemeSwitch } from '#/common';
import { ReusableLogo } from './reusable-logo';
import { cn } from '#/lib';
import type { MobileMenuProps, NavLink } from '../top-bars';

export const ReusableMobileMenu: React.FC<MobileMenuProps> = ({
  logo,
  navLinks,
  actions,
  showThemeToggle = true,
}) => {
  const defaultNavLinks: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ];

  const finalNavLinks = navLinks || defaultNavLinks;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-md hover:bg-accent/50 transition-colors"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[280px] p-0 border-l border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/40">
            <div className="flex items-center">
              {logo || (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-background rounded-sm" />
                  </div>
                  <span className="font-medium text-sm">Menu</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {finalNavLinks.map((link) => (
                <div key={link.href}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target={link.target || '_blank'}
                      rel="noopener noreferrer"
                      className={cn(
                        'flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-colors',
                        'hover:bg-accent/50 text-foreground/80 hover:text-foreground',
                        'group relative',
                        link.className,
                      )}
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className={cn(
                        'flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-colors',
                        'hover:bg-accent/50 text-foreground/80 hover:text-foreground',
                        'group relative',
                        link.className,
                      )}
                    >
                      <span>{link.label}</span>
                      <div className="w-2 h-2 rounded-full bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Theme Toggle - Vercel Style */}
            {showThemeToggle && (
              <div className="mt-6 pt-4 border-t border-border/40">
                <div className="text-xs font-medium text-foreground/60 mb-2 px-3">
                  Theme
                </div>
                <div className="px-3 py-2">
                  <ThemeSwitch />
                </div>
              </div>
            )}
          </nav>

          {/* Action Buttons - Vercel Style */}
          {actions && actions.length > 0 && (
            <div className="p-4 border-t border-border/40 bg-muted/20">
              <div className="space-y-2">
                {actions.map((action: any, index: any) => (
                  <React.Fragment key={index}>
                    {action.href ? (
                      action.href.startsWith('http') ? (
                        <Button
                          variant={
                            action.variant === 'outline' ? 'outline' : 'default'
                          }
                          size="sm"
                          className={cn(
                            'w-full justify-between h-9 font-normal text-sm',
                            action.variant === 'outline'
                              ? 'border-border/60 hover:bg-accent/50'
                              : 'bg-foreground text-background hover:bg-foreground/90',
                            action.className,
                          )}
                          asChild
                        >
                          <a
                            href={action.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{action.label}</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant={
                            action.variant === 'outline' ? 'outline' : 'default'
                          }
                          size="sm"
                          className={cn(
                            'w-full justify-between h-9 font-normal text-sm',
                            action.variant === 'outline'
                              ? 'border-border/60 hover:bg-accent/50'
                              : 'bg-foreground text-background hover:bg-foreground/90',
                            action.className,
                          )}
                          asChild
                        >
                          <Link to={action.href}>
                            <span>{action.label}</span>
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      )
                    ) : (
                      <Button
                        variant={
                          action.variant === 'outline' ? 'outline' : 'default'
                        }
                        size="sm"
                        className={cn(
                          'w-full justify-between h-9 font-normal text-sm',
                          action.variant === 'outline'
                            ? 'border-border/60 hover:bg-accent/50'
                            : 'bg-foreground text-background hover:bg-foreground/90',
                          action.className,
                        )}
                        onClick={action.onClick}
                      >
                        <span>{action.label}</span>
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
