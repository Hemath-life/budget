'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@repo/ui/components/ui';
import { 
  Wallet, 
  Menu, 
  X, 
  ArrowRight,
  BarChart3,
  Target,
  Bell,
  Shield,
  Smartphone,
  Zap,
  TrendingUp,
  ChevronRight,
  Star,
  Sparkles,
  LayoutDashboard,
  Receipt,
  FolderOpen,
  Repeat,
  FileText,
  Download,
  Settings,
  CircleDollarSign
} from 'lucide-react';

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900">
      <nav className="mx-auto max-w-6xl px-6" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black dark:bg-white">
              <Wallet className="h-5 w-5 text-white dark:text-black" />
            </div>
            <span className="text-lg font-semibold text-black dark:text-white">Budget</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-full px-5">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-900">
            <div className="flex flex-col gap-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-gray-900">
                <Link href="/login">
                  <Button variant="outline" className="w-full rounded-full">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-black dark:bg-white text-white dark:text-black rounded-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-1.5 text-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
            <span className="text-gray-600 dark:text-gray-400">New: AI-powered insights</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black dark:text-white leading-tight">
            Manage your money
            <br />
            <span className="text-green-600 dark:text-green-500">with confidence</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Track expenses, set budgets, and achieve your financial goals. Simple, intuitive, and powerful.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-full px-8 py-6 text-base font-medium">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-medium border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                See how it works
              </Button>
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex -space-x-2">
                {['bg-gradient-to-br from-violet-500 to-purple-600', 'bg-gradient-to-br from-blue-500 to-cyan-500', 'bg-gradient-to-br from-green-500 to-emerald-500', 'bg-gradient-to-br from-orange-500 to-red-500'].map((gradient, i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                  +50k
                </div>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">50,000+ happy users</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500 drop-shadow-sm" />
                ))}
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">4.9/5 rating</span>
              <span className="text-gray-400 text-xs">(2.5k reviews)</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative">
          {/* Glow effects */}
          <div className="absolute -inset-4 bg-linear-to-r from-green-500/20 via-emerald-500/30 to-teal-500/20 rounded-3xl blur-2xl opacity-70 animate-pulse" />
          <div className="absolute inset-0 bg-linear-to-tr from-green-600/10 to-transparent rounded-2xl" />
          
          <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-1.5 shadow-2xl shadow-green-500/10">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 rounded-t-xl">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
                <div className="h-3 w-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <div className="h-3 w-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1.5 rounded-lg bg-white dark:bg-black text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 flex items-center gap-2 shadow-sm">
                  <span className="text-green-500">🔒</span>
                  <span>app.budget.com/dashboard</span>
                </div>
              </div>
              <div className="w-16" />
            </div>
            
            {/* Dashboard content */}
            <div className="rounded-b-xl bg-white dark:bg-black p-6">
              {/* Stats row */}
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  { label: 'Total Income', value: '₹1,25,000', change: '+12%', icon: '📈', color: 'from-green-500 to-emerald-600' },
                  { label: 'Expenses', value: '₹78,500', change: '-8%', icon: '💳', color: 'from-orange-500 to-red-500' },
                  { label: 'Balance', value: '₹46,500', change: '+23%', icon: '💰', color: 'from-blue-500 to-indigo-600' },
                  { label: 'Savings', value: '₹12,000', change: '+5%', icon: '🎯', color: 'from-purple-500 to-pink-500' },
                ].map((stat) => (
                  <div 
                    key={stat.label} 
                    className="group relative rounded-xl border border-gray-100 dark:border-gray-800 p-4 bg-linear-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className={`absolute inset-0 rounded-xl bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.label}</p>
                        <span className="text-lg">{stat.icon}</span>
                      </div>
                      <p className="text-2xl font-bold text-black dark:text-white">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-400">vs last month</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Chart area */}
              <div className="mt-4 rounded-xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-black dark:text-white">Monthly Overview</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Income vs Expenses (2024)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-sm bg-green-500" />
                      <span className="text-xs text-gray-500">Income</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-sm bg-rose-400" />
                      <span className="text-xs text-gray-500">Expenses</span>
                    </div>
                  </div>
                </div>
                
                {/* Chart with fixed height bars */}
                <div className="flex items-end gap-2 h-40 px-2">
                  {[
                    { month: 'J', income: 95, expense: 72 },
                    { month: 'F', income: 88, expense: 65 },
                    { month: 'M', income: 102, expense: 78 },
                    { month: 'A', income: 110, expense: 82 },
                    { month: 'M', income: 98, expense: 70 },
                    { month: 'J', income: 115, expense: 85 },
                    { month: 'J', income: 108, expense: 75 },
                    { month: 'A', income: 120, expense: 88 },
                    { month: 'S', income: 112, expense: 80 },
                    { month: 'O', income: 125, expense: 78 },
                    { month: 'N', income: 118, expense: 82 },
                    { month: 'D', income: 135, expense: 92 },
                  ].map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-px items-end h-32">
                        <div 
                          className="flex-1 bg-green-100 hover:bg-green-400 rounded-t-sm transition-colors min-h-1 opacity-10"
                          style={{ height: `${Math.round((data.income / 140) * 100)}%` }}
                        />
                        <div 
                          className="flex-1 bg-rose-100 hover:bg-rose-300 rounded-t-sm transition-colors min-h-1 opacity-10"
                          style={{ height: `${Math.round((data.expense / 140) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{data.month}</span>
                    </div>
                  ))}
                </div>
                
                {/* Summary */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-around">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Total Income</p>
                    <p className="text-sm font-bold text-green-600">₹13.2L</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Total Expenses</p>
                    <p className="text-sm font-bold text-rose-500">₹9.5L</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Savings</p>
                    <p className="text-sm font-bold text-blue-600">₹3.7L</p>
                  </div>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[
                  { icon: '➕', label: 'Add', desc: 'Transaction' },
                  { icon: '📊', label: 'Reports', desc: 'View all' },
                  { icon: '🎯', label: 'Goals', desc: 'Track' },
                  { icon: '⚙️', label: 'Settings', desc: 'Configure' },
                ].map((action) => (
                  <div key={action.label} className="group rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-center hover:border-green-500/50 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-all cursor-pointer">
                    <span className="text-xl group-hover:scale-110 inline-block transition-transform">{action.icon}</span>
                    <p className="text-xs font-medium text-black dark:text-white mt-1">{action.label}</p>
                    <p className="text-[10px] text-gray-400">{action.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -right-4 top-20 hidden lg:block animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 shadow-xl shadow-green-500/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-600">+23%</p>
                  <p className="text-[10px] text-gray-500">Savings up!</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -left-4 bottom-32 hidden lg:block animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 shadow-xl shadow-purple-500/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-600">Goal: 80%</p>
                  <p className="text-[10px] text-gray-500">New Car</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Get detailed insights into your spending patterns with beautiful charts.',
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set savings goals and track your progress towards financial milestones.',
    },
    {
      icon: Bell,
      title: 'Bill Reminders',
      description: 'Never miss a payment with smart reminders for upcoming bills.',
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Your data is protected with enterprise-grade encryption.',
    },
    {
      icon: Smartphone,
      title: 'Works Everywhere',
      description: 'Access your finances on any device with responsive design.',
    },
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'Instant updates across all your devices.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white">
            Everything you need
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Powerful features to help you take control of your finances.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 hover:border-green-500 dark:hover:border-green-500 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 group-hover:bg-green-500 transition-colors">
                <feature.icon className="h-5 w-5 text-green-600 dark:text-green-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PagesOutlineSection() {
  const pages = [
    {
      icon: LayoutDashboard,
      title: 'Dashboard',
      description: 'Get a complete overview of your finances at a glance',
      features: ['Income & Expense Summary', 'Recent Transactions', 'Budget Progress', 'Goals Overview'],
    },
    {
      icon: Receipt,
      title: 'Transactions',
      description: 'Track every transaction with detailed categorization',
      features: ['Add/Edit Transactions', 'Filter & Search', 'Category Tags', 'Date Range Views'],
    },
    {
      icon: CircleDollarSign,
      title: 'Budgets',
      description: 'Create and manage budgets for different categories',
      features: ['Monthly Budgets', 'Category Limits', 'Progress Tracking', 'Overspending Alerts'],
    },
    {
      icon: FolderOpen,
      title: 'Categories',
      description: 'Organize your transactions with custom categories',
      features: ['Custom Categories', 'Color Coding', 'Icons Selection', 'Category Stats'],
    },
    {
      icon: Target,
      title: 'Goals',
      description: 'Set and track your financial goals',
      features: ['Savings Goals', 'Target Dates', 'Progress Tracking', 'Milestone Alerts'],
    },
    {
      icon: TrendingUp,
      title: 'Income',
      description: 'Track all your income sources',
      features: ['Multiple Sources', 'Recurring Income', 'Income History', 'Growth Analytics'],
    },
    {
      icon: Repeat,
      title: 'Recurring',
      description: 'Manage recurring transactions automatically',
      features: ['Auto-scheduling', 'Frequency Options', 'Skip/Pause', 'History Log'],
    },
    {
      icon: Bell,
      title: 'Reminders',
      description: 'Never miss a bill or payment deadline',
      features: ['Bill Reminders', 'Custom Alerts', 'Email Notifications', 'Due Date Tracking'],
    },
    {
      icon: FileText,
      title: 'Reports',
      description: 'Detailed financial reports and insights',
      features: ['Monthly Reports', 'Category Analysis', 'Trend Charts', 'Comparison Views'],
    },
    {
      icon: Download,
      title: 'Export',
      description: 'Export your data in multiple formats',
      features: ['CSV Export', 'PDF Reports', 'Date Range Selection', 'Custom Fields'],
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Customize your app experience',
      features: ['Currency Settings', 'Theme Options', 'Profile Management', 'Notifications'],
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-1.5 text-sm mb-6">
            <span className="text-gray-600 dark:text-gray-400">Complete Feature Set</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white">
            Explore all pages
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            A comprehensive suite of tools to manage every aspect of your finances.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page, index) => (
            <div
              key={page.title}
              className="group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-5 hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-lg"
            >
              {/* Page number */}
              <div className="absolute top-4 right-4 text-xs font-mono text-gray-300 dark:text-gray-700">
                {String(index + 1).padStart(2, '0')}
              </div>
              
              {/* Icon and Title */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 group-hover:border-green-500 group-hover:bg-green-50 dark:group-hover:bg-green-950/30 transition-colors">
                  <page.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black dark:text-white group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors">
                    {page.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
                    {page.description}
                  </p>
                </div>
              </div>

              {/* Features list */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {page.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center rounded-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 px-2.5 py-0.5 text-xs text-gray-600 dark:text-gray-400"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation hint */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            All pages are accessible from the sidebar after you sign up
          </p>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    {
      content: "BudgetApp completely changed how I manage my money. I've saved more in 3 months than I did all of last year!",
      author: 'Priya Sharma',
      role: 'Software Engineer',
      avatar: 'PS',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      content: "The goal tracking feature is amazing. Watching my savings grow towards my dream vacation keeps me motivated.",
      author: 'Rahul Verma',
      role: 'Marketing Manager',
      avatar: 'RV',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      content: "Finally, a budgeting app that's actually easy to use. The interface is beautiful and intuitive.",
      author: 'Anita Patel',
      role: 'Freelance Designer',
      avatar: 'AP',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <section id="testimonials" className="py-24 relative">
      <div className="absolute inset-0 bg-linear-to-b from-background via-emerald-50/30 dark:via-emerald-950/10 to-background -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Loved by
            <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">thousands of users</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our users have to say about their experience with BudgetApp.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="relative group rounded-3xl border bg-card/50 backdrop-blur-sm p-8 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-yellow-400 drop-shadow-sm"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground leading-relaxed text-lg">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl bg-linear-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: 'Is BudgetApp free to use?',
      answer: 'Yes! We offer a free plan with essential features. Upgrade to Pro or Premium for advanced features.',
    },
    {
      question: 'Is my financial data secure?',
      answer: 'Absolutely. We use bank-level 256-bit encryption to protect your data.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Pro and Premium users can export their transaction history to CSV or PDF formats.',
    },
    {
      question: 'Does it work on mobile?',
      answer: 'Yes! BudgetApp works on smartphones, tablets, and desktop computers.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, cancel anytime. You\'ll have access until your billing period ends.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white">
            Questions & Answers
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <span className="font-medium text-black dark:text-white">{faq.question}</span>
                <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${openIndex === i ? 'rotate-90' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 mb-6">
          <Sparkles className="h-6 w-6 text-green-500" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white">
          Start managing your money today
        </h2>
        
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Join thousands of users who trust Budget to track their finances.
        </p>
        
        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300 hover:scale-105">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <p className="mt-4 text-sm text-gray-500">
          No credit card required • Free forever
        </p>
      </div>
    </section>
  );
}

export function LandingFooter() {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Integrations', href: '#' },
      { name: 'Changelog', href: '#' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Templates', href: '#' },
    ],
    legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Cookies', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-950 dark:bg-black border-t border-gray-800/50">
      <div className="mx-auto max-w-6xl px-6">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Budget</span>
            </div>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
              Smart budgeting made simple. Take control of your finances and achieve your financial goals.
            </p>
            {/* Social links */}
            <div className="mt-6 flex items-center gap-4">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-all duration-200">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-all duration-200">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-all duration-200">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 Budget. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
