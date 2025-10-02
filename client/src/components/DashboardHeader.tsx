const DashboardHeader = () => {
  return (
    <header className="border-b border-border backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg md:text-xl font-bold font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#a48fff] via-[#00bcd4] to-[#7afcff]">
                DREAMY
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
