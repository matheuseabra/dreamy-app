import generated1 from "@/assets/generated-1.jpg";
import generated2 from "@/assets/generated-2.jpg";
import generated3 from "@/assets/generated-3.jpg";
import generated4 from "@/assets/generated-4.jpg";
import generated5 from "@/assets/generated-5.jpg";
import generated6 from "@/assets/generated-6.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center px-4 relative overflow-hidden">

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-left">
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

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-normal">
            Awaken Your Inner {" "}
              <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Creativity
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              Create breathtaking visuals from simple text prompts. Our advanced
              AI models bring your wildest imaginations to life with
              photorealistic precision and artistic flair.
            </p>

            <div className="flex justify-start">
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

          {/* Right Column - Image Showcase Grid */}
          <div className="flex justify-center lg:justify-end">
            <div className="grid grid-cols-3 gap-3 h-[500px] w-full max-w-lg">
              {/* Top Left - Square */}
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={generated1} 
                  alt="AI Generated Image" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Top Center - Square */}
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={generated2} 
                  alt="AI Generated Image 2" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Top Right - Tall Rectangle (spans 2 rows) */}
              <div className="rounded-lg overflow-hidden row-span-2">
                <img 
                  src={generated3} 
                  alt="AI Generated Image 3" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Bottom Left - Square */}
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={generated4} 
                  alt="AI Generated Image 4" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Bottom Center - Square */}
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={generated5} 
                  alt="AI Generated Image 5" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Bottom Right - Square */}
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={generated6} 
                  alt="AI Generated Image 6" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
