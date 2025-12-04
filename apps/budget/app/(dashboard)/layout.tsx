'use client';
import { budgetSidebarData } from '@/lib/layout';
import { AuthenticatedLayout, Main, Section } from '@repo/ui/layout';
import { HeaderNav } from '@repo/ui/nbars';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedLayout
      sidebarData={budgetSidebarData}
      sidebarDefaultOpen
      searchPlaceholder="Search pages & quick actions"
    >
      <Main className="flex flex-col bg-background p-0" fixed>
        <HeaderNav />
        <Section className="flex-1 overflow-auto rounded-xl border bg-card/30 p-2 lg:p-4" fixed>
          <div className="space-y-6">{children}</div>
        </Section>
      </Main>
    </AuthenticatedLayout>
  );
}
