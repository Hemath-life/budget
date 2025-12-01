import Link from "next/link";
import { Wallet, TrendingUp, PiggyBank, Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Left Side - Gradient Background with Features */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Gradient orbs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl">BudgetApp</span>
          </Link>
          
          {/* Headline */}
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Smart money management starts here
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            Join thousands who have transformed their financial life with our intuitive tools.
          </p>
          
          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Track Everything</p>
                <p className="text-sm text-slate-400">Monitor income, expenses & investments</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
                <PiggyBank className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Reach Your Goals</p>
                <p className="text-sm text-slate-400">Set savings targets and achieve them</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Bank-Level Security</p>
                <p className="text-sm text-slate-400">Your data is encrypted & protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-background">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl">BudgetApp</span>
            </Link>
          </div>
          
          {children}
          
          {/* Back link */}
          <p className="text-center mt-8">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
