import useAuth from "@/hooks/useAuth";
import { Bell, LogOut, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const displayName = user?.email?.split("@")[0] ?? "User";
  const initials =
    (user?.user_metadata?.full_name as string | undefined)
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || (displayName[0] ?? "U").toUpperCase();
  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) || undefined;
  const credits = 0; // TODO: wire with real credits

  return (
    <header className="border-border border-b backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[#a48fff] via-[#00bcd4] to-[#7afcff] opacity-90 shadow-sm" />
            <Logo className="text-xl" /> */}
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              style={{
                border: "1px solid transparent",
                backgroundImage: `
              linear-gradient(to bottom, #0e0e10, #2c2833),
              linear-gradient(135deg, rgb(168 85 247), rgb(59 130 246), rgb(147 197 253))
            `,
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
              className="h-9 rounded-xl px-4 text-sm font-medium"
            >
              <span className="bg-gradient-to-r from-pink-300 via-blue-300 to-white bg-clip-text text-transparent font-bold">
                Upgrade
              </span>
              <Sparkles className="h-4 w-4 mr-1" />
            </Button>
            <div className="mx-1 h-5 w-px bg-border" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 border border-border"
                align="end"
                forceMount
              >
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.user_metadata?.full_name && (
                      <p className="font-medium">
                        {user.user_metadata.full_name}
                      </p>
                    )}
                    {user?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-400">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
