import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const AIModelsShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const models = [
    {
      name: "Ideogram",
      description: "Revolutionary AI model that excels at creating stunning typography and professional logos. Generate crisp, readable text in any style and create brand assets that stand out from the crowd.",
      image: "/api/placeholder/400/300",
      features: ["Perfect Typography", "Logo Creation", "Brand Identity"]
    },
    {
      name: "Flux",
      description: "The gold standard for photorealistic image generation. Create breathtaking visuals with incredible detail, lifelike textures, and professional-grade quality that rivals traditional photography.",
      image: "/api/placeholder/400/300", 
      features: ["Photorealistic", "Ultra-High Detail", "Professional Quality"]
    },
    {
      name: "Nano Banana",
      description: "Lightning-fast generation that delivers results in seconds, not minutes. Perfect for rapid iteration, brainstorming sessions, and when you need quick results without sacrificing quality.",
      image: "/api/placeholder/400/300",
      features: ["Lightning Fast", "Rapid Iteration", "Real-time Creation"]
    },
    {
      name: "WAN",
      description: "Unleash your creativity with this artistic powerhouse. Generate unique, expressive images with distinctive styles that push the boundaries of digital art and creative expression.",
      image: "/api/placeholder/400/300",
      features: ["Artistic Expression", "Unique Styles", "Creative Freedom"]
    }
  ];

  const nextModel = () => {
    setCurrentIndex((prev) => (prev + 1) % models.length);
  };

  const prevModel = () => {
    setCurrentIndex((prev) => (prev - 1 + models.length) % models.length);
  };

  const currentModel = models[currentIndex];

  return (
    <section className="py-20 px-4 relative">
      {/* Purple Radial Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 700px at 50% 500px, rgba(139, 92, 246, 0.34), transparent)`,
        }}
      />
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-white">Industry Leading</span><br />
              <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Image Models
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              Choose from the world's most advanced AI image models. Each one is fine-tuned for specific creative needs, giving you the perfect tool for every project.
            </p>

            {/* Navigation Arrows */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevModel}
                className="w-12 h-12 rounded-full border-slate-600 hover:border-purple-400 hover:bg-purple-900/20 text-slate-300 hover:text-purple-300 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextModel}
                className="w-12 h-12 rounded-full border-slate-600 hover:border-purple-400 hover:bg-purple-900/20 text-slate-300 hover:text-purple-300 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right Section - Model Showcase Cards */}
          <div className="flex justify-center lg:justify-end">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              {/* Main Model Card */}
              <div 
                className="rounded-lg overflow-hidden col-span-1 md:col-span-2"
                style={{
                  border: "1px solid transparent",
                  backgroundImage: `
                    linear-gradient(to bottom, rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.9)),
                    linear-gradient(135deg, rgb(168 85 247 / 0.3), rgb(59 130 246 / 0.3), rgb(147 197 253 / 0.3))
                  `,
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
              >
                {/* Model Info Header */}
                <div className="p-6 bg-slate-800/50">
                  <h3 className="text-2xl font-bold text-white mb-3">{currentModel.name}</h3>
                  <p className="text-slate-300 leading-relaxed">{currentModel.description}</p>
                </div>
                
                {/* Model Image */}
                <div className="h-64 bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-300">{currentModel.name.charAt(0)}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{currentModel.name} Model</p>
                  </div>
                </div>
              </div>

              {/* Feature Tags */}
              <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2 justify-center">
                {currentModel.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Pagination Dots */}
              <div className="col-span-1 md:col-span-2 flex justify-center gap-2 mt-4">
                {models.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-purple-400 scale-125'
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
