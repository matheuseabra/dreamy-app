import useAuth from "@/hooks/useAuth";
import { Bell, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const DashboardHeader = () => {
  const { user } = useAuth();
  const displayName = user?.email?.split("@")[0] ?? "User";
  const initials = (user?.user_metadata?.full_name as string | undefined)?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || (displayName[0] ?? "U").toUpperCase();
  const avatarUrl = (user?.user_metadata?.avatar_url as string | undefined) || undefined;
  const credits = 0; // TODO: wire with real credits

  return (
    <header className="border-none backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[#a48fff] via-[#00bcd4] to-[#7afcff] opacity-90 shadow-sm" />
            <Logo className="text-xl" /> */}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
            <Button className="h-9 rounded-full px-4 text-sm font-medium text-white bg-gradient-to-r from-[#6b5bff] via-[#7f63ff] to-[#a7f3ff] shadow-sm hover:opacity-95">
              Subscribe!
            </Button>
            <div className="mx-1 h-5 w-px bg-border" />
            <div className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm">
              <Star className="h-4 w-4" />
              <span className="tabular-nums">{credits}</span>
            </div>
            <Avatar className="ml-2 h-9 w-9">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
