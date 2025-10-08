import moonBg from "@/assets/moon-bg.webp";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section 
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${moonBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto text-center relative">
        <div className="max-w-4xl mx-auto">
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
              New Release
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Turn Ideas Into{" "}
            <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Masterpieces
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create breathtaking visuals from simple text prompts. Our advanced AI models bring your wildest 
            imaginations to life with photorealistic precision and artistic flair.
          </p>

          <div className="flex justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="text-lg px-8 py-6 text-black font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, #E0B0FF 0%, #ADD8E6 50%, #FFC0CB 100%)",
                  border: "none",
                }}
              >
                Start Creating Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
