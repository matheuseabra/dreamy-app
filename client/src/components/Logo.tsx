import magicMindLogo from "@/assets/mage-mind-purple-logo.png";
import React from "react";

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className="flex items-center gap-1">
      <img
        src={magicMindLogo}
        alt="logo"
        className={`h-10 w-auto ${className}`}
      />
      <h4 className="font-serif font-medium">Wizzard</h4>
    </div>
  );
};

export default Logo;
