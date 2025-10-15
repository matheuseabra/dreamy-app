
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-transparent backdrop-blur-md z-50 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className="text-white hover:text-purple-300 transition-colors">
              Explore
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="text-white hover:text-purple-300 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-white hover:text-purple-300 transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-white hover:text-purple-300 transition-colors"
            >
              FAQ
            </button>
            <Link to="/login">
              <Button variant="link" className="text-white text-md hover:text-purple-300 hover:no-underline transition-colors">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button
                className="text-black font-semibold"
                style={{
                  background: "linear-gradient(135deg, #E0B0FF 0%, #ADD8E6 50%, #FFC0CB 100%)",
                  border: "none",
                }}
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2 text-white hover:text-purple-300 hover:bg-white/10"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 bg-background/95 backdrop-blur-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-3">
              <Link to="/explore" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-300 transition-colors text-left px-2 py-2 rounded-md hover:bg-white/5">
                Explore
              </Link>
              <button
                onClick={() => scrollToSection('features')}
                className="text-white hover:text-purple-300 transition-colors text-left px-2 py-2 rounded-md hover:bg-white/5"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-white hover:text-purple-300 transition-colors text-left px-2 py-2 rounded-md hover:bg-white/5"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-white hover:text-purple-300 transition-colors text-left px-2 py-2 rounded-md hover:bg-white/5"
              >
                FAQ
              </button>
              <div className="flex flex-col space-y-2 pt-2 border-t border-white/10">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-white hover:text-purple-300 hover:bg-white/10">Sign In</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    className="w-full text-black font-semibold"
                    style={{
                      background: "linear-gradient(135deg, #E0B0FF 0%, #ADD8E6 50%, #FFC0CB 100%)",
                      border: "none",
                    }}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
