import React from "react";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/components/layout/AppSidebar.tsx";
import AppHeader from "@/components/layout/AppHeader.tsx";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = ()  => {
    return (
        <SidebarProvider className="w-screen h-screen">
            <AppSidebar />
            <SidebarInset>
                <header className="flex sticky top-0 bg-sidebar h-[5rem] shrink-0 items-center gap-2 border-b px-4">
                    <AppHeader />
                </header>
                <main>
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};
