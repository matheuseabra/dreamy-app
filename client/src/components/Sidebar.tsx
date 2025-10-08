import { Compass, FolderOpen, LibraryBig, Sparkles, Star } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarPrimitive,
  SidebarSeparator
} from "./ui/sidebar";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      path: "/explore",
      icon: Compass,
      label: "Explore",
    },
    {
      path: "/generate",
      icon: Sparkles,
      label: "Generate",
    },
    {
      path: "/project",
      icon: LibraryBig,
      label: "Project",
    },
    {
      path: "/assets",
      icon: FolderOpen,
      label: "Assets",
    },
    {
      path: "/favorites",
      icon: Star,
      label: "Favorites",
    },
  ];

  const libraryItems = [
    {
      path: "/assets",
      icon: FolderOpen,
      label: "Assets",
    },
    {
      path: "/favorites",
      icon: Star,
      label: "Favorites",
    },
  ];

  return (
    <SidebarPrimitive className="bg-background z-20 border-border" collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center justify-between">
          <Logo className="text-4xl" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1 py-6">
        <SidebarGroup className="px-1">
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.path)}
                  className="h-10 text-md font-medium"
                >
                  <Link to={item.path}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="my-2 opacity-30" />
      </SidebarContent>
    </SidebarPrimitive>
  );
};

export default Sidebar;
