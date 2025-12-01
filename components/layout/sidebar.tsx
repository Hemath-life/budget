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
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

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
      <nav className={cn(
        "space-y-1 transition-all duration-300 ease-in-out",
        isCollapsed ? "px-2" : "px-3"
      )}>
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          const linkContent = (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center rounded-lg text-sm font-medium transition-all duration-300 ease-in-out overflow-hidden',
                isCollapsed ? 'justify-center w-11 h-11 px-0 mx-auto' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0 transition-transform duration-300" />
              <span 
                className={cn(
                  "truncate transition-all duration-300 ease-in-out",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}
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
      className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 border-r bg-card z-50",
        "transition-[width] duration-300 ease-in-out",
        isCollapsed ? "lg:w-[70px]" : "lg:w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex h-16 items-center border-b shrink-0",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "justify-center px-2" : "px-6"
      )}>
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <PiggyBank className="h-8 w-8 text-primary shrink-0 transition-transform duration-300" />
          <span 
            className={cn(
              "text-xl font-bold whitespace-nowrap transition-all duration-300 ease-in-out",
              isCollapsed ? "w-0 opacity-0 scale-95" : "w-auto opacity-100 scale-100"
            )}
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
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-16 items-center border-b px-6 shrink-0">
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
