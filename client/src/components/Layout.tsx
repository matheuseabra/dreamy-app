import { cn } from "@/lib/utils";
import {
  Compass,
  FolderOpen,
  LibraryBig,
  Pencil,
  Sparkles,
  Star,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator
} from "./ui/sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider className="min-h-screen bg-background">
      <div className="flex w-full">
        {/* Sidebar */}
        <Sidebar className="z-20 border-border" collapsible="icon">
          <SidebarHeader className="px-3 py-4">
            {/* <div className="flex items-center justify-between gap-2 px-1">
              <Logo className="text-2xl" />
            </div> */}
          </SidebarHeader>

          <SidebarContent className="px-1 py-6">
            <SidebarGroup className="px-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/")}
                    className="h-12 text-md font-medium"
                  >
                    <Link to="/">
                      <Compass className="h-5 w-5" />
                      <span>Explore</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/generate")}
                    className="h-12 text-md font-medium"
                  >
                    <Link to="/generate">
                      <Sparkles className="h-5 w-5" />
                      <span>Generate</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/edit")}
                    className="h-12 text-md font-medium"
                  >
                    <Link to="/edit">
                      <Pencil className="h-5 w-5" />
                      <span>Edit</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/project")}
                    className="h-12 text-md font-medium"
                  >
                    <Link to="/project">
                      <LibraryBig className="h-5 w-5" />
                      <span>Project</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator className="my-2 opacity-30" />

            <SidebarGroup className="px-1">
              <SidebarGroupLabel className="px-2 text-sm tracking-wide text-muted-foreground">
                Library
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/assets")}
                    className="h-12 text-md font-medium"
                  >
                    <Link to="/assets">
                      <FolderOpen className="h-5 w-5" />
                      <span>Assets</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/favorites")}
                    className="h-12 text-md font-medium"
                  >
                    <Link to="/favorites">
                      <Star className="h-5 w-5" />
                      <span>Favorites</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className={cn("flex-1 min-h-screen bg-background")}>
          <DashboardHeader />
          <main className="w-full">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
