"use client";

import { useTheme } from "next-themes";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileSidebar } from "./sidebar";
import { Moon, Sun, Bell, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Header() {
  const { setTheme } = useTheme();
  const reminders = useAppSelector((state) => state.reminders.items);
  const settings = useAppSelector((state) => state.settings);

  const upcomingReminders = reminders.filter((r) => {
    const dueDate = new Date(r.dueDate);
    const today = new Date();
    const daysUntil = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return !r.isPaid && daysUntil <= r.notifyBefore && daysUntil >= 0;
  });

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <MobileSidebar />

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {/* Currency Display */}
          <Badge variant="outline" className="hidden sm:flex">
            {settings.defaultCurrency}
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
                        Due: {new Date(reminder.dueDate).toLocaleDateString()} -
                        ${reminder.amount}
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
