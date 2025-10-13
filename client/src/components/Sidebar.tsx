import {
  Compass,
  Edit3,
  FolderOpen,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Star,
} from "lucide-react";
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
  Sidebar as SidebarPrimitive
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
      path: "/imagine",
      icon: Sparkles,
      label: "Imagine",
    },
    {
      path: "/edit",
      icon: Edit3,
      label: "Edit",
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
    <SidebarPrimitive
      className="sticky top-0 h-screen bg-background border border-none w-60"
      collapsible="none"
    >
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
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

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
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4">
        <SidebarGroup>
          <SidebarMenu>
            {supportItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={isActive(item.path)}>
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
