import { getDocsNavigation } from '@/lib/docs';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DocsSidebarProps {
  currentPath?: string;
}

export async function DocsSidebar({ currentPath = '' }: DocsSidebarProps) {
  const navigation = await getDocsNavigation();

  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r md:sticky md:block">
      <div className="h-full py-6 pr-6 lg:py-8">
        <nav className="space-y-1">
          {navigation.items.map((item, index) => {
            if (item.type === 'separator') {
              return (
                <div key={`sep-${index}`} className="pt-4 pb-2">
                  <h4 className="font-semibold text-sm text-foreground px-3">
                    {item.title}
                  </h4>
                </div>
              );
            }

            const currentHref = currentPath ? `/docs/${currentPath}` : '/docs';
            const isActive = currentHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted',
                  isActive
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
