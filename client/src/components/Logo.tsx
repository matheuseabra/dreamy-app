import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <h1
      className={`text-lg md:text-xl font-bold font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#a48fff] via-[#00bcd4] to-[#7afcff] ${className}`}
    >
      DREAMY
    </h1>
  );
};

export default Logo;
