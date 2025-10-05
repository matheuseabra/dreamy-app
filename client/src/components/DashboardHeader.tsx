import Logo from './Logo';

const DashboardHeader = () => {
  return (
    <header className="border-b border-border backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <Logo />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
