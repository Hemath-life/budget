import { DocsSidebar } from '@/components/docs/docs-sidebar';
import Link from 'next/link';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">💰 Budget App</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/docs"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Docs
            </Link>
            <Link
              href="/docs/api"
              className="transition-colors hover:text-foreground/80 text-muted-foreground"
            >
              API
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-muted-foreground"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <div className="container flex-1">
        <div className="flex gap-12">
          {/* Sidebar */}
          <DocsSidebar />

          {/* Content */}
          <main className="flex-1 py-6 lg:py-8">
            <div className="mx-auto max-w-3xl">{children}</div>
          </main>

          {/* Table of contents (optional) */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-20 py-6">
              {/* TOC can be added here */}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
