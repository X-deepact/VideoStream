import MyProfile from "@/components/layout/MyProfile.tsx";

const AppHeader = () => {
  return (
    <header className="flex sticky top-0 bg-sidebar h-[3rem] shrink-0 items-center gap-2 border-b px-4">
      <div className="w-full items-center px-4 py-2 flex">
        <div className="flex justify-end space-x-4 ml-auto">
          <MyProfile />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
