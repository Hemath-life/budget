'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
  Sparkles,
  TrendingUp,
  PieChart,
  CreditCard,
  DollarSign
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/40">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">BudgetApp</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-violet-600 transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-violet-50 dark:hover:bg-violet-950/30">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-violet-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link href="/login">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
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
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-violet-50 via-indigo-50/30 to-background dark:from-violet-950/20 dark:via-indigo-950/10 dark:to-background" />
        <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 px-5 py-2 text-sm font-medium backdrop-blur-sm mb-8 group hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400 group-hover:rotate-12 transition-transform" />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Now with AI-powered insights</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block">Smart Money</span>
            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
              Management
            </span>
            <span className="block mt-2">Made Simple</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-3xl text-lg text-muted-foreground sm:text-xl lg:text-2xl leading-relaxed">
            Your personal finance companion. Track spending, crush savings goals, 
            and build wealth with beautiful insights that actually make sense.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-1 transition-all rounded-2xl group">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl border-2 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:border-violet-300 dark:hover:border-violet-700 transition-all">
                Watch Demo
              </Button>
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {['#8B5CF6', '#6366F1', '#EC4899', '#14B8A6', '#F59E0B'].map((color, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">50,000+ users</p>
                <p className="text-muted-foreground">loving BudgetApp</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="h-6 w-6 text-yellow-400 fill-yellow-400 drop-shadow-sm"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">4.9/5 stars</p>
                <p className="text-muted-foreground">from 2,500+ reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="mt-20 relative">
          <div className="relative mx-auto max-w-6xl">
            {/* Floating cards for visual interest */}
            <div className="absolute -left-8 top-20 hidden lg:block">
              <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-2xl shadow-green-500/25 rotate-3 hover:rotate-6 transition-transform">
                <TrendingUp className="h-8 w-8 text-white mb-2" />
                <p className="text-white/90 text-sm font-medium">+23% savings</p>
                <p className="text-white/70 text-xs">this month</p>
              </div>
            </div>
            
            <div className="absolute -right-8 bottom-32 hidden lg:block">
              <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 shadow-2xl shadow-violet-500/25 -rotate-3 hover:-rotate-6 transition-transform">
                <Target className="h-8 w-8 text-white mb-2" />
                <p className="text-white/90 text-sm font-medium">Goal: 80%</p>
                <p className="text-white/70 text-xs">New Car Fund</p>
              </div>
            </div>

            {/* Main Dashboard Preview */}
            <div className="rounded-3xl bg-gradient-to-b from-muted/80 to-muted p-3 shadow-2xl ring-1 ring-border/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-green-500 shadow-sm" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-6 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-medium text-muted-foreground border border-border/50">
                    <span className="text-green-500 mr-1">🔒</span>
                    app.budgetapp.com
                  </div>
                </div>
              </div>
              <div className="rounded-b-2xl bg-gradient-to-br from-background to-muted/30 p-6 sm:p-10">
                {/* Dashboard stats */}
                <div className="grid gap-4 md:grid-cols-4 mb-6">
                  {[
                    { icon: DollarSign, label: 'Total Income', value: '₹1,25,000', color: 'from-green-500 to-emerald-600', textColor: 'text-green-600 dark:text-green-400' },
                    { icon: CreditCard, label: 'Total Expenses', value: '₹78,500', color: 'from-red-500 to-rose-600', textColor: 'text-red-600 dark:text-red-400' },
                    { icon: Wallet, label: 'Balance', value: '₹46,500', color: 'from-violet-500 to-purple-600', textColor: 'text-violet-600 dark:text-violet-400' },
                    { icon: Target, label: 'Savings', value: '₹12,000', color: 'from-blue-500 to-cyan-600', textColor: 'text-blue-600 dark:text-blue-400' },
                  ].map((stat, i) => (
                    <div key={stat.label} className="rounded-2xl border bg-card/80 backdrop-blur-sm p-5 hover:shadow-lg transition-all hover:-translate-y-1 group">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                {/* Chart placeholder */}
                <div className="rounded-2xl border bg-card/60 backdrop-blur-sm p-8 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5" />
                  <div className="relative">
                    <PieChart className="h-32 w-32 text-muted-foreground/20 group-hover:text-violet-500/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative blur effects */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 blur-3xl -z-10" />
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
      description: 'Get detailed insights into your spending patterns with beautiful charts and reports.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set savings goals and track your progress towards achieving financial milestones.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Bell,
      title: 'Bill Reminders',
      description: 'Never miss a payment with smart reminders for upcoming bills and subscriptions.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your financial data is protected with enterprise-grade encryption.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access your finances anywhere with our responsive design that works on all devices.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Zap,
      title: 'Instant Sync',
      description: 'Real-time updates across all your devices. Add a transaction and see it everywhere.',
      gradient: 'from-yellow-500 to-amber-500',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Features</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Everything you need to
            <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">manage your money</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you take control of your finances 
            and build wealth over time.
          </p>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="relative group rounded-3xl border bg-card/50 backdrop-blur-sm p-8 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg shadow-${feature.gradient.split('-')[1]}-500/25 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-bold group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{feature.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
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
      <div className="absolute inset-0 bg-gradient-to-b from-background via-violet-50/30 dark:via-violet-950/10 to-background -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Loved by
            <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">thousands of users</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our users have to say about their experience with BudgetApp.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="relative group rounded-3xl border bg-card/50 backdrop-blur-sm p-8 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
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
  const faqs = [
    {
      question: 'Is BudgetApp free to use?',
      answer: 'Yes! We offer a free plan with essential features. You can upgrade to Pro or Premium for advanced features like unlimited transactions, detailed reports, and multi-currency support.',
    },
    {
      question: 'Is my financial data secure?',
      answer: 'Absolutely. We use bank-level 256-bit encryption to protect your data. Your information is stored securely and never shared with third parties.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Pro and Premium users can export their transaction history to CSV or PDF formats for tax purposes or personal records.',
    },
    {
      question: 'Does it work on mobile devices?',
      answer: 'Yes! BudgetApp is fully responsive and works beautifully on smartphones, tablets, and desktop computers.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access to premium features until the end of your billing period.',
    },
  ];

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background -z-10" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 mb-4">
            <Sparkles className="h-4 w-4" />
            <span>FAQ</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Frequently Asked</span>
            <span className="block">Questions</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="mt-16 space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              className="group rounded-2xl border bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
            >
              <h3 className="font-bold text-lg group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{faq.question}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 px-8 py-20 sm:px-16 sm:py-24 shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-2 text-sm font-medium text-white mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Start Your Journey</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ready to transform your
              <span className="block mt-2">financial life?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-white/90 leading-relaxed">
              Join 50,000+ users who are already saving more and spending smarter with BudgetApp.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-10 py-7 bg-white text-violet-600 hover:bg-white/90 shadow-2xl hover:scale-105 transition-all rounded-2xl font-bold group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="flex flex-col sm:items-start items-center gap-1">
                <p className="text-sm text-white/90 font-medium">
                  ✓ No credit card required
                </p>
                <p className="text-sm text-white/90 font-medium">
                  ✓ 14-day free trial
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">BudgetApp</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <a href="#" className="text-muted-foreground hover:text-violet-600 transition-colors font-medium">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-violet-600 transition-colors font-medium">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-violet-600 transition-colors font-medium">Contact</a>
            <a href="#" className="text-muted-foreground hover:text-violet-600 transition-colors font-medium">Blog</a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2025 BudgetApp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
