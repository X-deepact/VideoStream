import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible.tsx'
import { data } from './SidebarData.ts'
import { ChevronRight } from 'lucide-react'
import { Separator } from '../ui/separator.tsx'
import { BreadcrumbLink } from '../ui/breadcrumb.tsx'
import { useLocation } from 'react-router-dom'

const AppSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <>
    
    <Sidebar collapsible="none" className='shadow-lg z-10'>
      <SidebarHeader className="h-[5rem]">
        <BreadcrumbLink href="/dashboard">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPwanQvAE76MPAUCrXzVepbg53TSMXsCV92cBvcd7S2oRCpuGyUzli4PY&s" className="h-full" style={{height: '8em', marginTop: '-2em'}} />
        </BreadcrumbLink>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible flex"
          >
            <SidebarGroup className="flex-1">
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
              >
                <CollapsibleTrigger>
                  {item.icon && <item.icon className="mr-2" />}
                  {item.title}{' '}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent className="transition-all duration-300">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => {
                      const isActive = location.pathname === subItem.url;
                      return (
                        <SidebarMenuItem key={subItem.title} className='flex items-center'>
                          <SidebarMenuButton
                            asChild
                            className={`ml-2 mr-2 flex items-center transition-colors duration-200 ${
                              isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                            }`}
                          >
                            <a href={subItem.url} className='text-gray-500'>
                              {subItem.title}
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
            <Separator className="my-2" />
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
          <Separator orientation="vertical" className="h-full w-px bg-gray-300" />
    </>
  )
}

export default AppSidebar
