import Logout from '@/components/layout/Logout.tsx'
import MyProfile from '@/components/layout/MyProfile.tsx'

const AppHeader = () => {
  return (
    <div className="w-full items-center px-4 py-2">
      <div className="flex justify-end space-x-4 ml-auto">
        <MyProfile />
        <Logout />
      </div>
    </div>
  )
}

export default AppHeader
