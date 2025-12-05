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
      <Main className="flex flex-col bg-background !p-0" fixed>
        <Header />
        <Section className="px-4 py-4 sm:px-6" fixed>
          {children}
        </Section>
      </Main>
    </AuthenticatedLayout>
  );
}
