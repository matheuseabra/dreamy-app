import { cn } from "@/lib/utils";
import React from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import {
  SidebarInset,
  SidebarProvider
} from "./ui/sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <SidebarProvider className="min-h-screen">
      <div className="flex">
        <Sidebar />
        <SidebarInset className={cn("flex-1 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black")}>
          <DashboardHeader />
          <main className="w-full">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
