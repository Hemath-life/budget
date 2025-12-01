'use client';

import { Sidebar, useSidebar, SidebarContext } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="h-screen overflow-hidden bg-background">
        <Sidebar />
        <div 
          className={`h-full flex flex-col transition-[padding] duration-300 ease-in-out ${
            isCollapsed ? 'lg:pl-[70px]' : 'lg:pl-64'
          }`}
        >
          <Header />
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
