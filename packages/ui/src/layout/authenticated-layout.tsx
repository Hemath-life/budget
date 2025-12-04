import { SearchProvider } from '#/common';
import {
  AppSidebar,
  SideBarMainLayout,
  SidebarProvider,
  SkipToMain,
} from '../nbars/sidebar';
import { sidebarData } from '../nbars/sidebar/data/sidebar-data';
import type { SidebarData } from './types';

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
        <AppSidebar sidebarData={finalSidebarData} />
        <SkipToMain />
        <SideBarMainLayout>{children ?? null}</SideBarMainLayout>
      </SidebarProvider>
    </SearchProvider>
  );
}
