import generated1 from "@/assets/generated-1.jpg";
import generated2 from "@/assets/generated-2.jpg";
import generated3 from "@/assets/generated-3.jpg";
import generated4 from "@/assets/generated-4.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-20 sm:pt-24 lg:pt-0">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_400px_at_78%_330px,hsl(var(--primary)/0.34),transparent)]" />
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <div
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-6 sm:mb-8 animate-pulse"

            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-purple-300" />
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                New Release
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight sm:leading-normal">
              Awaken Your Inner{" "}
              <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Creativity
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Create breathtaking visuals from simple text prompts. Our advanced
              AI models bring your wildest imaginations to life with
              photorealistic precision and artistic flair.
            </p>

            <div className="flex justify-center lg:justify-start">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 text-black font-semibold w-full sm:w-auto"
                  style={{
                    background:
                      "linear-gradient(135deg, #E0B0FF 0%, #ADD8E6 50%, #FFC0CB 100%)",
                    border: "none",
                  }}
                >
                  Start Creating Free
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Image Showcase Grid */}
          <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 h-[350px] sm:h-[450px] lg:h-[500px] w-full max-w-lg">
              {/* Top Left - Small Square */}
              <div className="rounded-lg overflow-hidden">
                <img
                  src={generated1}
                  alt="AI Generated Image"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Top Right - Wide Rectangle (largest) */}
              <div className="rounded-lg overflow-hidden">
                <img
                  src={generated2}
                  alt="AI Generated Image 2"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Bottom Left - Larger Square */}
              <div className="rounded-lg overflow-hidden">
                <img
                  src={generated3}
                  alt="AI Generated Image 3"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Bottom Right - Square (similar to top-left) */}
              <div className="rounded-lg overflow-hidden">
                <img
                  src={generated4}
                  alt="AI Generated Image 4"
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
