'use client';

import { Sidebar, SidebarContext } from "@/apps/components/layout/sidebar";
import { Header } from "@/apps/components/layout/header";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="h-screen overflow-hidden bg-background">
        <Sidebar />
        <div 
          className={`h-full flex flex-col transition-[padding-left] duration-300 ease-out ${isLargeScreen ? (isCollapsed ? 'lg:pl-sidebar-collapsed' : 'lg:pl-sidebar') : ''}`}
        >
          <Header />
          <main className="flex-1 overflow-auto p-2 lg:p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
