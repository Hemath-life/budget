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
  TrendingUp,
  PieChart,
  CreditCard,
  ChevronRight,
  Check,
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
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white dark:border-black bg-gray-200 dark:bg-gray-800"
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400 ml-1">50,000+ users</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-1.5 shadow-xl">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-700" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-white dark:bg-black text-xs text-gray-500 dark:text-gray-500 border border-gray-200 dark:border-gray-800">
                  app.budget.com
                </div>
              </div>
            </div>
            {/* Dashboard content */}
            <div className="rounded-b-xl bg-white dark:bg-black p-6">
              {/* Stats row */}
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  { label: 'Income', value: '₹1,25,000', change: '+12%', positive: true },
                  { label: 'Expenses', value: '₹78,500', change: '-8%', positive: true },
                  { label: 'Balance', value: '₹46,500', change: '+23%', positive: true },
                  { label: 'Savings', value: '₹12,000', change: '+5%', positive: true },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-500">{stat.label}</p>
                    <p className="text-xl font-semibold text-black dark:text-white mt-1">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                ))}
              </div>
              {/* Chart area */}
              <div className="mt-4 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-end justify-between h-32 gap-2">
                  {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 50, 95].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-green-500 dark:bg-green-600 rounded-sm transition-all hover:bg-green-600 dark:hover:bg-green-500"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-400">
                  <span>Jan</span>
                  <span>Dec</span>
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
      <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-50/30 dark:via-emerald-950/10 to-background -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Loved by
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">thousands of users</span>
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
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
    <section className="py-20 bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl bg-black dark:bg-white p-10 sm:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white dark:text-black">
            Ready to take control?
          </h2>
          <p className="mt-4 text-gray-400 dark:text-gray-600 max-w-lg mx-auto">
            Join 50,000+ users who are already saving more and spending smarter.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-6 text-base font-medium">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-black py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white">
              <Wallet className="h-4 w-4 text-white dark:text-black" />
            </div>
            <span className="font-semibold text-black dark:text-white">Budget</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors">Contact</a>
          </div>

          <p className="text-sm text-gray-500">
            © 2025 Budget. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
