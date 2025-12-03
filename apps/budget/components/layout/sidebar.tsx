'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  FolderOpen,
  PiggyBank,
  Target,
  BarChart3,
  Repeat,
  Bell,
  Settings,
  Download,
  Menu,
} from 'lucide-react';
import { useState, createContext, useContext } from 'react';
import { Button } from '@/apps/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/apps/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/apps/components/ui/tooltip';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Income', href: '/income', icon: TrendingUp },
  { name: 'Expenses', href: '/expenses', icon: TrendingDown },
  { name: 'Categories', href: '/categories', icon: FolderOpen },
  { name: 'Budgets', href: '/budgets', icon: PiggyBank },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Recurring', href: '/recurring', icon: Repeat },
  { name: 'Reminders', href: '/reminders', icon: Bell },
  { name: 'Export', href: '/export', icon: Download },
  { name: 'Settings', href: '/settings', icon: Settings },
];

// Context for sidebar state
const SidebarContext = createContext<{ isCollapsed: boolean; setIsCollapsed: (value: boolean) => void }>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

function NavLinks({ onNavigate, isCollapsed }: { onNavigate?: () => void; isCollapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <nav 
        className="space-y-1"
        style={{
          paddingLeft: isCollapsed ? '8px' : '12px',
          paddingRight: isCollapsed ? '8px' : '12px',
          transition: 'padding 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          const linkContent = (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center rounded-lg text-sm font-medium overflow-hidden',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              style={{
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                width: isCollapsed ? '44px' : '100%',
                height: '44px',
                padding: isCollapsed ? '0' : '0 12px',
                gap: isCollapsed ? '0' : '12px',
                margin: isCollapsed ? '0 auto' : '0',
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span 
                className="truncate"
                style={{
                  width: isCollapsed ? '0px' : 'auto',
                  opacity: isCollapsed ? 0 : 1,
                  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {item.name}
              </span>
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>
    </TooltipProvider>
  );
}

export function Sidebar() {
  const { isCollapsed } = useSidebar();

  return (
    <aside 
      className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 border-r bg-card z-50 transition-[width] duration-300 ease-out ${isCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar'}`}
    >
      {/* Logo */}
      <div 
        className={`flex items-center border-b shrink-0 h-header transition-all duration-300 ease-out ${isCollapsed ? 'justify-center px-2' : 'px-6'}`}
      >
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <PiggyBank className="h-8 w-8 text-primary shrink-0" />
          <span 
            className="text-xl font-bold whitespace-nowrap overflow-hidden"
            style={{
              width: isCollapsed ? '0px' : 'auto',
              opacity: isCollapsed ? 0 : 1,
              transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            BudgetApp
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 overflow-hidden">
        <NavLinks isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-sidebar p-0">
        <div className="flex items-center border-b px-6 shrink-0 h-header">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <PiggyBank className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">BudgetApp</span>
          </Link>
        </div>
        <div className="py-4 overflow-hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { SidebarContext };
