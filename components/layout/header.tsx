"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useTransactions, useCategories, useBudgets, useGoals, useSettings, useReminders } from "@/lib/hooks";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { MobileSidebar, useSidebar } from "./sidebar";
import { 
  Moon, Sun, PanelLeftClose, PanelLeft, Search,
  LayoutDashboard, ArrowLeftRight, TrendingUp, TrendingDown, FolderOpen,
  PiggyBank, Target, BarChart3, Repeat, Bell, Download, Palette, DollarSign,
  Plus, ArrowUpRight, ArrowDownRight, Settings, LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { data: settings } = useSettings();
  const { data: transactions = [] } = useTransactions();
  const { data: categories = [] } = useCategories();
  const { data: budgets = [] } = useBudgets();
  const { data: goals = [] } = useGoals();
  const { data: reminders = [] } = useReminders();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const currency = settings?.defaultCurrency || 'INR';

  const upcomingReminders = reminders.filter((r) => {
    const dueDate = new Date(r.dueDate);
    const today = new Date();
    const daysUntil = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return !r.isPaid && daysUntil <= r.notifyBefore && daysUntil >= 0;
  });

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Navigation pages
  const pages = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Overview of your finances" },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight, description: "View all transactions" },
    { name: "Add Transaction", href: "/transactions/add", icon: Plus, description: "Record a new transaction" },
    { name: "Income", href: "/income", icon: TrendingUp, description: "Track your earnings" },
    { name: "Expenses", href: "/expenses", icon: TrendingDown, description: "Monitor your spending" },
    { name: "Categories", href: "/categories", icon: FolderOpen, description: "Manage categories" },
    { name: "Budgets", href: "/budgets", icon: PiggyBank, description: "Set spending limits" },
    { name: "Goals", href: "/goals", icon: Target, description: "Track savings goals" },
    { name: "Reports", href: "/reports", icon: BarChart3, description: "Financial analytics" },
    { name: "Recurring", href: "/recurring", icon: Repeat, description: "Recurring transactions" },
    { name: "Reminders", href: "/reminders", icon: Bell, description: "Bill reminders" },
    { name: "Export", href: "/export", icon: Download, description: "Download your data" },
  ];

  // Settings pages
  const settingsPages = [
    { name: "General Settings", href: "/settings", icon: Settings, description: "App preferences" },
    { name: "Currency Settings", href: "/settings/currency", icon: DollarSign, description: "Change default currency" },
    { name: "Theme Settings", href: "/settings/theme", icon: Palette, description: "Customize appearance" },
  ];

  // Recent transactions (last 5)
  const recentTransactions = useMemo(() => 
    [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [transactions]
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <header className="shrink-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <MobileSidebar />
        
        {/* Sidebar Toggle - Desktop */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex"
              >
                {isCollapsed ? (
                  <PanelLeft className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Search - Centered */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl">
            <Button
              variant="outline"
              className="relative h-10 w-full justify-start rounded-lg bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12"
              onClick={() => setOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline-flex">Search pages, transactions, settings...</span>
              <span className="inline-flex sm:hidden">Search...</span>
              <kbd className="pointer-events-none absolute right-[0.5rem] top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
        </div>

        {/* Command Dialog / Global Search */}
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search pages, transactions, settings..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            
            {/* Quick Actions */}
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => runCommand(() => router.push("/transactions/add"))}>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}>
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                Toggle Theme
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            {/* Pages */}
            <CommandGroup heading="Pages">
              {pages.map((page) => (
                <CommandItem
                  key={page.href}
                  onSelect={() => runCommand(() => router.push(page.href))}
                >
                  <page.icon className="mr-2 h-4 w-4" />
                  <span>{page.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{page.description}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Settings */}
            <CommandGroup heading="Settings">
              {settingsPages.map((page) => (
                <CommandItem
                  key={page.href}
                  onSelect={() => runCommand(() => router.push(page.href))}
                >
                  <page.icon className="mr-2 h-4 w-4" />
                  <span>{page.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{page.description}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            {recentTransactions.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Recent Transactions">
                  {recentTransactions.map((transaction) => (
                    <CommandItem
                      key={transaction.id}
                      onSelect={() => runCommand(() => router.push(`/transactions/${transaction.id}`))}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      <span>{transaction.description}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {getCategoryName(transaction.category)} • {formatCurrency(transaction.amount, currency)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {budgets.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Budgets">
                  {budgets.slice(0, 3).map((budget) => (
                    <CommandItem
                      key={budget.id}
                      onSelect={() => runCommand(() => router.push("/budgets"))}
                    >
                      <PiggyBank className="mr-2 h-4 w-4" />
                      <span>{getCategoryName(budget.category)}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {formatCurrency(budget.spent, currency)} / {formatCurrency(budget.amount, currency)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {goals.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Goals">
                  {goals.slice(0, 3).map((goal) => (
                    <CommandItem
                      key={goal.id}
                      onSelect={() => runCommand(() => router.push("/goals"))}
                    >
                      <Target className="mr-2 h-4 w-4" />
                      <span>{goal.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {formatCurrency(goal.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {categories.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Categories">
                  {categories.slice(0, 5).map((category) => (
                    <CommandItem
                      key={category.id}
                      onSelect={() => runCommand(() => router.push("/categories"))}
                    >
                      <div 
                        className="mr-2 h-3 w-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground capitalize">{category.type}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </CommandDialog>

        {/* Right Corner Actions */}
        <div className="flex items-center gap-2">
          {/* Currency Display */}
          <Badge variant="outline" className="hidden sm:flex">
            {settings?.defaultCurrency || 'INR'}
          </Badge>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {upcomingReminders.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {upcomingReminders.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {upcomingReminders.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No upcoming reminders
                </div>
              ) : (
                upcomingReminders.slice(0, 5).map((reminder) => (
                  <DropdownMenuItem key={reminder.id} asChild>
                    <Link
                      href="/reminders"
                      className="flex flex-col items-start gap-1 p-3"
                    >
                      <span className="font-medium">{reminder.title}</span>
                      <span className="text-xs text-muted-foreground">
                        Due: {formatDate(reminder.dueDate)} - {formatCurrency(reminder.amount, currency)}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))
              )}
              {upcomingReminders.length > 5 && (
                <DropdownMenuItem asChild>
                  <Link
                    href="/reminders"
                    className="text-center text-sm text-primary"
                  >
                    View all reminders
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Settings className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
