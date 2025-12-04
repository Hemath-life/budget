'use client';

import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/ui';
import { FileText, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface SearchItem {
  title: string;
  href: string;
  section?: string;
}

const DOCS_SEARCH_ITEMS: SearchItem[] = [
  // Introduction
  {
    title: 'Installation',
    href: '/docs/installation',
    section: 'Introduction',
  },
  {
    title: 'Project Structure',
    href: '/docs/project-structure',
    section: 'Introduction',
  },
  // Getting Started
  {
    title: 'Transactions',
    href: '/docs/transactions',
    section: 'Getting Started',
  },
  { title: 'Budgets', href: '/docs/budgets', section: 'Getting Started' },
  { title: 'Goals', href: '/docs/goals', section: 'Getting Started' },
  { title: 'Categories', href: '/docs/categories', section: 'Getting Started' },
  // Features
  {
    title: 'Recurring Transactions',
    href: '/docs/recurring',
    section: 'Features',
  },
  { title: 'Reminders', href: '/docs/reminders', section: 'Features' },
  // Reference
  { title: 'API Overview', href: '/docs/api', section: 'Reference' },
  { title: 'Database Schema', href: '/docs/database', section: 'Reference' },
  {
    title: 'UI Package & Tree-Shaking',
    href: '/docs/ui-package',
    section: 'Reference',
  },
];

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-md bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {['Introduction', 'Getting Started', 'Features', 'Reference'].map(
            (section) => (
              <CommandGroup key={section} heading={section}>
                {DOCS_SEARCH_ITEMS.filter(
                  (item) => item.section === section
                ).map((item) => (
                  <CommandItem
                    key={item.href}
                    value={item.title}
                    onSelect={() => runCommand(() => router.push(item.href))}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {item.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
