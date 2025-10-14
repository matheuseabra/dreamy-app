import React from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <SidebarProvider className="min-h-screen">
      <Sidebar />
      <SidebarInset className="relative">
        {/* <div className="absolute inset-0 z-99 bg-[radial-gradient(circle_450px_at_48%_0px,hsl(var(--primary)/0.34),transparent)]" /> */}
        <DashboardHeader />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
