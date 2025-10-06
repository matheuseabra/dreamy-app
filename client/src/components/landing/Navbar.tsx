
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
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-foreground hover:text-primary transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="text-foreground hover:text-primary transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="text-foreground hover:text-primary transition-colors"
            >
              FAQ
            </button>
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="text-foreground hover:text-primary transition-colors text-left"
              >
                FAQ
              </button>
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
