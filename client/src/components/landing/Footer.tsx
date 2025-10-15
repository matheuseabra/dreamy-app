
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  Github,
  Heart,
  Linkedin,
  Mail,
  Twitter
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t border-border relative">
      {/* Purple Radial Glow Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_700px_at_50%_500px,hsl(var(--primary)/0.34),transparent)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Create stunning AI-generated images with cutting-edge technology.
              Transform your ideas into visual masterpieces.
            </p>
            <div className="flex space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
                <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
                <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Product</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-muted-foreground hover:text-primary transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/models" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Models
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Support</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/status" className="text-muted-foreground hover:text-primary transition-colors">
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/licenses" className="text-muted-foreground hover:text-primary transition-colors">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              <span>© 2024 Dreamy Studio. Made with</span>
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-1 text-red-500" />
              <span>for creators worldwide.</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="text-muted-foreground hover:text-primary text-xs sm:text-sm"
            >
              <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Back to top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
