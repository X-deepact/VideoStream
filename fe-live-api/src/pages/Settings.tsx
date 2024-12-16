import AppLayout from "@/layouts/AppLayout";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

const Settings = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { icon: "🔍", label: "Info", path: "info", textColor: "muted", bgColor: "bg-blue-600" },
    {
      icon: "🔒",
      label: "Authentication",
      path: "authentication",
      textColor: "muted",
      bgColor: "bg-blue-600",
    },
    {
      icon: "🚀",
      label: "Advanced",
      path: "advanced",
      textColor: "muted-500",
      bgColor: "bg-blue-600",
    },
  ];

  return (
    <AppLayout>
      {/* Mobile Menu Button */}
      <div className="lg:hidden p-4 border-b  border-muted-700">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div
          className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            fixed lg:relative
            top-0 left-0
            h-full w-64
            ${isSidebarOpen ? 'bg-[#020613]' : 'bg-muted-600'}
            p-4
            border-r border-muted-700
            transition-transform duration-300 ease-in-out
            z-30 lg:z-auto
          `}
        >
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {menuItems.map((item) => {
            const isActive = location.pathname.endsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 hover:opacity-90 rounded-md mb-2 
                  ${isActive ? `${item.bgColor} text-white` : 'bg-muted text-muted-500'}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 bg-muted-600 w-full overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="bg-muted-600 rounded-lg p-4 lg:p-6">
              <Outlet context={menuItems} />
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Settings;
