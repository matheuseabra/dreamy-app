import { cn } from "@/lib/utils";
import React from "react";
import DashboardHeader from "./DashboardHeader";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "./ui/sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <SidebarProvider className="min-h-screen bg-background">
      <div className="flex w-full">
        {/* Sidebar */}
        <Sidebar className="z-20 border-border" collapsible="icon">
          <SidebarHeader className="px-3 py-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-3">
            {/* Keep existing controls or nav here if needed */}
          </SidebarContent>
          <SidebarFooter className="mt-auto px-2 py-3">
            {/* Footer actions */}
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* Main area */}
        <SidebarInset className={cn("flex-1 min-h-screen bg-background")}>
          <DashboardHeader />
          <main className="w-full">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
