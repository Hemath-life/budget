/**
 * @fileoverview Sidebar component exports for the admin application layout system.
 *
 * This module provides a collection of sidebar-related components that work together
 * to create a responsive and accessible navigation layout. The components include
 * the main sidebar, layout containers, providers for sidebar state management,
 * and accessibility features.
 *
 * @module SidebarComponents
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import {
 *   AppSidebar,
 *   SideBarMainLayout,
 *   SidebarProvider,
 *   SkipToMain,
 *   SidebarTrigger
 * } from './components/layouts/sidebar'
 *
 * function Layout({ children }) {
 *   return (
 *     <SidebarProvider defaultOpen={false}>
 *       <AppSidebar />
 *       <SkipToMain />
 *       <SideBarMainLayout>
 *         {children}
 *       </SideBarMainLayout>
 *     </SidebarProvider>
 *   )
 * }
 * ```
 */
/**
 * Main application sidebar component that provides navigation functionality.
 * Contains menu items, user information, and collapsible sections.
 *
 * @component
 * @since 1.0.0
 */
/**
 * Layout container component that wraps the main content area.
 * Handles responsive behavior and proper spacing when sidebar is open/closed.
 *
 * @component
 * @since 1.0.0
 */
/**
 * Context provider component that manages sidebar state (open/closed) and
 * provides sidebar-related functionality to child components.
 *
 * @component
 * @since 1.0.0
 */
/**
 * Accessibility component that provides a "skip to main content" link
 * for keyboard navigation and screen reader users.
 *
 * @component
 * @since 1.0.0
 */
/**
 * Interactive component that allows users to toggle the sidebar visibility.
 * Typically rendered as a hamburger menu or toggle button.
 *
 * @component
 * @since 1.0.0
 */
import { AppSidebar } from './app-sidebar'
import { SideBarMainLayout } from './main-layout'
import { SidebarProvider, SidebarTrigger } from './sidebar'
import { SkipToMain } from './skip-to-main'

/*
import { Outlet } from '@tanstack/react-router'
import {
  AppSidebar,
  SideBarMainLayout,
  SkipToMain,
  SidebarProvider,
} from '../layouts/sidebar'

interface Props {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: Props) {
  return (
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SkipToMain />
        <SideBarMainLayout>
          {children ? children : <Outlet />}
        </SideBarMainLayout>
      </SidebarProvider>
  )
}

*/

export {
  AppSidebar,
  SideBarMainLayout,
  SidebarProvider,
  SkipToMain,
  SidebarTrigger,
}

