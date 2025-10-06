import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-gray-900/20 to-black/30 pointer-events-none" />
      
      <div className="container mx-auto text-center relative">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full mb-8 animate-pulse"
            style={{
              border: "1px solid transparent",
              backgroundImage: `
                linear-gradient(to bottom, rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.9)),
                linear-gradient(135deg, rgb(168 85 247), rgb(59 130 246), rgb(147 197 253))
              `,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <Sparkles className="w-4 h-4 mr-2 text-purple-300" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              AI-Powered Image Generation
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Create Stunning Images with{" "}
            <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              AI Magic
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into breathtaking visuals using cutting-edge AI models. 
            From concept to creation in seconds, not hours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 text-black font-semibold"
                style={{
                  background: "linear-gradient(135deg, #E0B0FF 0%, #ADD8E6 50%, #FFC0CB 100%)",
                  border: "none",
                }}
              >
                Start Creating Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-purple-400/50 text-purple-300 hover:bg-purple-900/20"
              onClick={() => scrollToSection('features')}
            >
              <Zap className="mr-2 w-5 h-5" />
              See Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
