import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Clock,
    Download,
    Layers,
    Palette,
    Shield,
    Sparkles,
    Wand2,
    Zap
} from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Multiple AI Models",
      description: "Choose from 10+ cutting-edge AI models including Flux, Recraft, and Ideogram for different styles and use cases."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Generate high-quality images in seconds with our optimized infrastructure and advanced caching system."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your images and prompts are encrypted and stored securely. We never share your data with third parties."
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "High Resolution",
      description: "Download images in multiple formats and resolutions up to 4K for professional use."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Advanced Controls",
      description: "Fine-tune your generations with style, quality, and size controls for perfect results every time."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Processing",
      description: "Watch your images generate in real-time with our live preview and progress tracking."
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Image to Image",
      description: "Transform existing images with AI-powered editing and style transfer capabilities."
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "Smart Prompts",
      description: "Get AI-powered prompt suggestions and improvements to enhance your creative process."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features for Creative Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create stunning AI-generated images with professional-grade quality and control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
