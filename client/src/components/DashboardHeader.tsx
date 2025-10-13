import useAuth from "@/hooks/useAuth";
import { Bell, LogOut, Sparkles } from "lucide-react";
import { Pricing } from "./landing/Pricing";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
  const credits = 0;

  return (
    <header className="border-none bg-background backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"></div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <div className="rounded-xl">
                  <Button
                    variant="outline"
                    className="h-9 px-6 text-sm font-medium relative overflow-hidden rounded-xl"
                    style={{
                      border: "1px solid transparent",
                      backgroundImage: `
                    linear-gradient(to bottom, rgba(10, 10, 10, 1), rgba(10, 10, 10, 0.8)),
                    linear-gradient(to bottom, rgba(164, 143, 255, 0.5), rgba(164, 143, 255, 1))
                  `,
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>Subscribe</span>
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-full border border-none w-full h-[100vh] sm:h-[100vh] sm:max-h-[100vh] mt-0">
                <Pricing />
              </DialogContent>
            </Dialog>
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
