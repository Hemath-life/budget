import { Suspense } from 'react';
import type { SidebarData } from './types';
import {
  AppSidebar,
  SideBarMainLayout,
  SidebarProvider,
  SkipToMain,
} from '../nbars/sidebar';
import { sidebarData } from '../nbars/sidebar/data/sidebar-data';
import { SearchProvider } from '#/common';

interface Props {
  children?: React.ReactNode;
  sidebarData?: SidebarData;
  sidebarDefaultOpen?: boolean;
  searchPlaceholder?: string;
}

export function AuthenticatedLayout({
  children,
  sidebarData: customSidebarData,
  sidebarDefaultOpen = false,
  searchPlaceholder,
}: Props) {
  const finalSidebarData = customSidebarData || sidebarData;

  return (
    <SearchProvider
      customSidebarData={finalSidebarData}
      placeholder={searchPlaceholder}
    >
      <SidebarProvider defaultOpen={sidebarDefaultOpen}>
        <Suspense fallback={null}>
          <AppSidebar sidebarData={finalSidebarData} />
        </Suspense>
        <SkipToMain />
        <SideBarMainLayout>{children ?? null}</SideBarMainLayout>
      </SidebarProvider>
    </SearchProvider>
  );
}
