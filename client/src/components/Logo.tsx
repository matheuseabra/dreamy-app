import blueWizLogo from "@/assets/wizr-logo-icon.webp";
import React from "react";

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className="flex items-center gap-2">
      <img
        src={blueWizLogo}
        alt="bluewizard logo"
        className={`h-10 w-auto ${className}`} // Apply className and set a default height
      />
      <span className="text-xl font-serif">MageMind</span>
    </div>
  );
};

export default Logo;
