import Link from "next/link";
import { Wallet } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-10 bg-emerald-600 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -translate-y-1/3 translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500 rounded-full translate-y-1/3 -translate-x-1/3 opacity-50" />
        
        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl">BudgetApp</span>
          </Link>
        </div>
        
        {/* Center Content */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3">
            Take control of your finances
          </h1>
          <p className="text-white/80 text-lg">
            Track expenses, set budgets, and achieve your financial goals.
          </p>
        </div>
        
        {/* Testimonial */}
        <div className="relative z-10 bg-white/10 rounded-xl p-5">
          <p className="italic mb-3">
            &ldquo;This app transformed how I manage my money!&rdquo;
          </p>
          <p className="text-sm text-white/70">— Sofia Davis</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl">BudgetApp</span>
            </Link>
          </div>
          
          {children}
          
          {/* Back link */}
          <p className="text-center mt-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
