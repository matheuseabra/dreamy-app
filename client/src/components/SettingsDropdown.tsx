import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

const SettingsDropdown = ({
  trigger,
  label,
  children,
  className = "w-56 border border-border",
}: {
  trigger: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
    <DropdownMenuContent align="start" className={className}>
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default SettingsDropdown;
