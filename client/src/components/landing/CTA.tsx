import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <Card
          className="overflow-hidden"
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
          <CardContent className="p-12 text-center">
            <div className="max-w-3xl mx-auto">
              {/* Icon */}
              <div className="mx-auto mb-6 p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 w-fit">
                <Sparkles className="w-8 h-8 text-purple-300" />
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Create Something Amazing?
              </h2>

              {/* Description */}
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already using Dreamy Studio
                to bring their ideas to life. Start generating stunning AI
                images today.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
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
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
