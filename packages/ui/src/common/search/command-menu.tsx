import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  IconArrowRightDashed,
  IconChevronRight,
  IconDeviceLaptop,
  IconMoon,
  IconSun,
} from '@tabler/icons-react'
import { useTheme } from '#/common/theme'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '#/components/ui/command'
import { ScrollArea } from '#/components/ui/scroll-area'
import { useSearch } from './search-context'
import type { SidebarData } from '#/layout'
import { sidebarData } from '../../nbars/sidebar/data/sidebar-data'

interface CommandMenuProps {
  customSidebarData?: SidebarData
  placeholder?: string
}

export function CommandMenu({ 
  customSidebarData, 
  placeholder = 'Type a command or search...' 
}: CommandMenuProps = {}) {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()
  
  // Use custom sidebar data if provided, otherwise use default
  const dataToUse = customSidebarData || sidebarData

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )


  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pr-1'>
          <CommandEmpty>No results found.</CommandEmpty>
          
          
          {/* Navigation from sidebar data */}
          {dataToUse.navGroups.map((group: any) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem: any, i: number) => {
                if (navItem.url) {
                  const IconComponent = navItem.icon
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => navigate({ to: navItem.url }))
                      }}
                    >
                      <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                        {IconComponent ? (
                          <IconComponent className='h-4 w-4' />
                        ) : (
                          <IconArrowRightDashed className='text-muted-foreground/80 size-2' />
                        )}
                      </div>
                      {navItem.title}
                    </CommandItem>
                  )
                }

                return navItem.items?.map((subItem: any, i: number) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${i}`}
                    value={`${navItem.title}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => navigate({ to: subItem.url }))
                    }}
                  >
                    <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                      <IconArrowRightDashed className='text-muted-foreground/80 size-2' />
                    </div>
                    {navItem.title} <IconChevronRight /> {subItem.title}
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}
          
          <CommandSeparator />
          <CommandGroup heading='Theme'>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <IconSun /> <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <IconMoon className='scale-90' />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <IconDeviceLaptop />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
