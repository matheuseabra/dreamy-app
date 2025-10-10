import { Compass, FolderOpen, HelpCircle, LibraryBig, MessageSquare, Sparkles, Star } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
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

  const supportItems = [
    {
      path: "/support",
      icon: HelpCircle,
      label: "Support",
    },
    {
      path: "/feedback",
      icon: MessageSquare,
      label: "Feedback",
    },
  ];

  return (
    <SidebarPrimitive className="sticky top-0 h-screen bg-background" collapsible="none">
      <SidebarHeader className="py-6 px-7">
        <div className="flex items-center justify-between">
          <Logo className="text-4xl" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.path} className="mb-1">
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
        {/* <SidebarSeparator className="opacity-30" /> */}
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarMenu>
            {libraryItems.map((item) => (
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
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-4">
        <SidebarSeparator className="opacity-30 mb-4" />
        <SidebarGroup>
          <SidebarMenu>
            {supportItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.path)}
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
      </SidebarFooter>
    </SidebarPrimitive>
  );
};

export default Sidebar;
