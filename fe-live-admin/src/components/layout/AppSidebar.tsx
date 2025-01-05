import React from 'react'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader, SidebarTrigger
} from '@/components/ui/sidebar'
import { data } from './SidebarData.ts'
import AppSidebarItem  from "./AppSidebarItem.tsx"
import Logo from "@/components/layout/Logo.tsx";

const AppSidebar = ({...props}: React.ComponentProps<typeof Sidebar> ) => {
  return (
    <Sidebar collapsible="icon" {...props} className='shadow-lg z-10'>
      <SidebarHeader>
	      <Logo />
      </SidebarHeader>
      <SidebarContent className="gap-0">
	      <AppSidebarItem items={data.navMain}/>
      </SidebarContent>
	    <SidebarFooter>
		    <SidebarTrigger />
	    </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
