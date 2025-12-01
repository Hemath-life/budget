import Link from "next/link";
import { Wallet } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Side - Branding & Visuals (Hidden on mobile) */}
      <div className="hidden relative lg:flex h-full flex-col bg-zinc-900 p-10 text-white dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl">BudgetApp</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This budget app has completely transformed how I manage my
              finances. The insights are incredible and it's so easy to
              use.&rdquo;
            </p>
            <footer className="text-sm text-zinc-400">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-[400px] space-y-6">
          {/* Mobile Logo (Visible only on mobile) */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Wallet className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl">BudgetApp</span>
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
