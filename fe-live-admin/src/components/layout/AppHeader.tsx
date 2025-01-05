import Logout from '@/components/layout/Logout.tsx'
import MyProfile from '@/components/layout/MyProfile.tsx'
import { siteData } from "@/components/layout/SidebarData.ts";
import { SidebarTrigger } from "@/components/ui/sidebar.tsx";

const AppHeader = () => {
  return (
		<header className="flex sticky top-0 bg-sidebar h-[5rem] shrink-0 items-center gap-2 border-b px-4">
			<div className="w-full items-center px-4 py-2 flex">
				<div className="flex justify-end space-x-4 ml-auto">
					<MyProfile />
					<Logout />
				</div>
			</div>
		</header>
  )
}

export default AppHeader
