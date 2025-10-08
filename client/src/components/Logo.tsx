import blueWizLogo from "@/assets/bluewizard-icon.png";
import React from "react";

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className="flex items-center gap-2">
      <img
        src={blueWizLogo}
        alt="bluewizard logo"
        className={`h-6 w-auto ${className}`} // Apply className and set a default height
      />
      <span className="text-lg font-bold">BlueWiz</span>
    </div>
  );
};

export default Logo;
