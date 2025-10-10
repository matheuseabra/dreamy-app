import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Edit = () => {
  const editFeatures = [
    {
      title: "Portrait Restyle",
      description: "Give your portrait an ID photo? Change hairstyle? Or perhaps a different outfit?",
      image: "/api/placeholder/300/400",
      stackedImages: [
        "/api/placeholder/300/400",
        "/api/placeholder/300/400"
      ]
    },
    {
      title: "Element Editing", 
      description: "Change the color of an object? Remove clutter? Or perhaps redesign it?",
      image: "/api/placeholder/300/400",
      stackedImages: [
        "/api/placeholder/300/400",
        "/api/placeholder/300/400"
      ]
    },
    {
      title: "Pet Portraits",
      description: "Take a studio-quality of your pet? Wedding photos? Or perhaps a birthday poster?",
      image: "/api/placeholder/300/400",
      stackedImages: [
        "/api/placeholder/300/400",
        "/api/placeholder/300/400"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/explore">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Edit Image</h1>
              <p className="text-sm text-muted-foreground">Transform your images with AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-6xl">
          {/* Main Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
              What's your edit idea today?
            </h1>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {editFeatures.map((feature, index) => (
              <Card 
                key={index}
                className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-0 bg-slate-800/40 backdrop-blur-sm cursor-pointer"
                style={{
                  border: "1px solid transparent",
                  backgroundImage: `
                    linear-gradient(to bottom, rgba(10, 10, 10, 1), rgba(10, 10, 10, 0.8)),
                    linear-gradient(to bottom, rgba(164, 143, 255, 0.5), rgba(164, 143, 255, 1))
                  `,
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
              >
                <CardContent className="p-0">
                  {/* Image Stack */}
                  <div className="relative h-64 bg-slate-700/50 rounded-t-lg overflow-hidden">
                    {/* Background stacked images */}
                    <div className="absolute inset-0">
                      <div className="absolute top-2 left-2 w-full h-full bg-slate-600/30 rounded-lg transform rotate-1"></div>
                      <div className="absolute top-1 left-1 w-full h-full bg-slate-500/20 rounded-lg transform -rotate-1"></div>
                    </div>
                    
                    {/* Main image placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3/4 h-3/4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30 flex items-center justify-center">
                        <div className="text-purple-300 text-sm font-medium">Edit Preview</div>
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
