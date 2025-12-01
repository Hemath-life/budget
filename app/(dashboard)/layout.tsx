'use client';

import { Sidebar, SidebarContext } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
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
          className="h-full flex flex-col"
          style={{
            paddingLeft: isLargeScreen ? (isCollapsed ? '70px' : '256px') : '0px',
            transition: 'padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
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
