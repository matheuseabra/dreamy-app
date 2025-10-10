import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Download,
    Eye,
    Image as ImageIcon,
    MoreHorizontal,
    Palette,
    RotateCcw,
    Save,
    Share2,
    Trash2,
    Upload,
    Wand2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Edit = () => {
  const [prompt, setPrompt] = useState(
    "A shadowy figure cloaked in mystery, Itachi Uchiha is a complex character from the popular anime series Naruto. His piercing red eyes and sleek black hair evoke a sense of danger and intrigue. This stunning portrait, whether drawn or painted, captures his enigmatic presence with exquisite detail. Every brushstroke seems to bring him to life, showcasing his enigmatic charm and enigmatic charisma. The image radiates excellence, showcasing Itachi's enigmatic"
  );

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
              <p className="text-sm text-muted-foreground">Edit your generated image</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Tools */}
        <div className="w-80 border-r border-border bg-muted/20">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tools</h2>
            
            {/* Tool Categories */}
            <div className="space-y-4">
              {/* Basic Tools */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Basic</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-12 flex-col">
                    <Wand2 className="h-4 w-4 mb-1" />
                    <span className="text-xs">Magic</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-12 flex-col">
                    <Palette className="h-4 w-4 mb-1" />
                    <span className="text-xs">Color</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-12 flex-col">
                    <ImageIcon className="h-4 w-4 mb-1" />
                    <span className="text-xs">Crop</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-12 flex-col">
                    <RotateCcw className="h-4 w-4 mb-1" />
                    <span className="text-xs">Rotate</span>
                  </Button>
                </div>
              </div>

              {/* Advanced Tools */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Advanced</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-12 flex-col">
                    <Wand2 className="h-4 w-4 mb-1" />
                    <span className="text-xs">AI Edit</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-12 flex-col">
                    <Palette className="h-4 w-4 mb-1" />
                    <span className="text-xs">Filter</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-12 flex-col">
                    <ImageIcon className="h-4 w-4 mb-1" />
                    <span className="text-xs">Resize</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-12 flex-col">
                    <RotateCcw className="h-4 w-4 mb-1" />
                    <span className="text-xs">Transform</span>
                  </Button>
                </div>
              </div>

              {/* Upload Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Import</h3>
                <Button variant="outline" className="w-full h-12 flex-col">
                  <Upload className="h-4 w-4 mb-1" />
                  <span className="text-xs">Upload Image</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Area */}
          <div className="flex-1 bg-muted/10 flex items-center justify-center p-8">
            <Card className="w-full max-w-4xl h-full">
              <CardContent className="p-0 h-full flex items-center justify-center">
                <div className="w-full h-full bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Image will appear here</p>
                    <p className="text-sm text-muted-foreground/70">Upload or generate an image to start editing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Panel - Prompt Bar */}
          <div className="border-t border-border bg-background p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-muted/50 rounded-xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the scene you imagine, with details."
                      className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm resize-none overflow-y-auto min-h-[60px] max-h-[120px]"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Wand2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Palette className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 border-l border-border bg-muted/20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Properties</h2>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Image Properties */}
              <div>
                <h3 className="text-sm font-medium mb-3">Image Properties</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="width" className="text-xs text-muted-foreground">Width</Label>
                    <Input id="width" placeholder="1024" className="h-8" />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs text-muted-foreground">Height</Label>
                    <Input id="height" placeholder="1024" className="h-8" />
                  </div>
                  <div>
                    <Label htmlFor="format" className="text-xs text-muted-foreground">Format</Label>
                    <Input id="format" placeholder="PNG" className="h-8" />
                  </div>
                </div>
              </div>

              {/* Generation Settings */}
              <div>
                <h3 className="text-sm font-medium mb-3">Generation Settings</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="model" className="text-xs text-muted-foreground">Model</Label>
                    <Input id="model" placeholder="Flux Dev" className="h-8" />
                  </div>
                  <div>
                    <Label htmlFor="quality" className="text-xs text-muted-foreground">Quality</Label>
                    <Input id="quality" placeholder="HD" className="h-8" />
                  </div>
                  <div>
                    <Label htmlFor="style" className="text-xs text-muted-foreground">Style</Label>
                    <Input id="style" placeholder="Natural" className="h-8" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-sm font-medium mb-3">Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Changes
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Image
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
