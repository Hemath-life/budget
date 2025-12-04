import type { SidebarData } from '@repo/ui/layout';
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  Download,
  FolderOpen,
  LayoutDashboard,
  PiggyBank,
  Repeat,
  Settings,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

export const budgetSidebarData: SidebarData = {
  user: {
    name: 'Demo User',
    email: 'demo@budgetapp.com',
    avatar: '/avatar.png',
  },
  teams: [
    {
      name: 'BudgetApp',
      logo: PiggyBank,
      plan: 'Finance Suite',
    },
    {
      name: 'Personal Finances',
      logo: Wallet,
      plan: 'Starter',
    },
  ],
  navGroups: [
    {
      title: 'overview',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Transactions', url: '/transactions', icon: ArrowLeftRight },
        { title: 'Income', url: '/income', icon: TrendingUp },
        { title: 'Expenses', url: '/expenses', icon: TrendingDown },
        { title: 'Categories', url: '/categories', icon: FolderOpen },
      ],
    },
    {
      title: 'Management',
      items: [
        { title: 'Budgets', url: '/budgets', icon: PiggyBank },
        { title: 'Goals', url: '/goals', icon: Target },
        { title: 'Reports', url: '/reports', icon: BarChart3 },
        { title: 'Recurring', url: '/recurring', icon: Repeat },
        { title: 'Reminders', url: '/reminders', icon: Bell },
        { title: 'Export', url: '/export', icon: Download },
      ],
    },

    {
      title: 'Settings',
      items: [
        {
          title: 'Preferences',
          icon: Settings,
          items: [
            { title: 'General', url: '/settings' },
            { title: 'Currency', url: '/settings/currency' },
            { title: 'Theme', url: '/settings/theme' },
          ],
        },
      ],
    },
  ],
};
