import React from "react";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/components/layout/AppSidebar.tsx";
import AppHeader from "@/components/layout/AppHeader.tsx";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = ()  => {
    return (
        <SidebarProvider className="w-screen h-screen">
            <AppSidebar />
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <AppHeader />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

