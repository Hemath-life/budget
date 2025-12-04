'use client';
import { Header } from '@/components/layout/header';
import { budgetSidebarData } from '@/lib/layout';
import { AuthenticatedLayout, Main, Section } from '@repo/ui/layout';

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
      <Main className="flex flex-col gap-4 bg-background p-0" fixed>
        <Header />
        <Section
          className="flex-1 overflow-auto rounded-xl border bg-card/30 p-2 lg:p-4"
          fixed
        >
          <div className="space-y-6">{children}</div>
        </Section>
      </Main>
    </AuthenticatedLayout>
  );
}
