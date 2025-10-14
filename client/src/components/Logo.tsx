import magicMindLogo from "@/assets/mage-mind-logo.svg";
import React from "react";

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className="flex items-center gap-1">
      <img
        src={magicMindLogo}
        alt="logo"
        className={`h-10 w-auto ${className}`} // Apply className and set a default height
      />
      <h4>MageMind</h4>
    </div>
  );
};

export default Logo;
