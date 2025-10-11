import { PromptBar } from "@/components/PromptBar";
import { Card, CardContent } from "@/components/ui/card";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { ImageIcon, PawPrintIcon, UserCircleIcon } from "lucide-react";

const Edit = () => {
  const {
    prompt,
    setPrompt,
    selectedModel,
    setSelectedModel,
    size,
    setSize,
    quality,
    setQuality,
    style,
    setStyle,
    isGenerating,
    handleGenerate,
  } = useImageGeneration();

  const editFeatures = [
    {
      title: "Portrait Restyle",
      description:
        "Give your portrait an ID photo? Change hairstyle? Or perhaps a different outfit?",
      icon: <UserCircleIcon />,
      stackedImages: ["/api/placeholder/300/400", "/api/placeholder/300/400"],
    },
    {
      title: "Element Editing",
      description:
        "Change the color of an object? Remove clutter? Or perhaps redesign it?",
      icon: <ImageIcon />,
      stackedImages: ["/api/placeholder/300/400", "/api/placeholder/300/400"],
    },
    {
      title: "Pet Portraits",
      description:
        "Take a studio-quality of your pet? Wedding photos? Or perhaps a birthday poster?",
      icon: <PawPrintIcon />,
      stackedImages: ["/api/placeholder/300/400", "/api/placeholder/300/400"],
    },
  ];

  return (
    <div className="container relative">
      <div className="flex items-center justify-center mt-24">
        <div className="mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-white mb-6">
              What's your edit idea today?
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {editFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group border-primary/50 bg-background/90 backdrop-blur-sm cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex mb-4">{feature.icon}</div>
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
          <div className="fixed w-full max-w-3xl mx-auto bottom-8 right-0 left-0 z-50">
            <PromptBar
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              size={size}
              onSizeChange={setSize}
              quality={quality}
              onQualityChange={setQuality}
              style={style}
              onStyleChange={setStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
