import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <h1
      className={`text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a48fff] via-[#00bcd4] to-[#7afcff] ${className}`}
    >
      Dreamy Studio
    </h1>
  );
};

export default Logo;
