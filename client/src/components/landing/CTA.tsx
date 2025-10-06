import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 overflow-hidden">
          <CardContent className="p-12 text-center">
            <div className="max-w-3xl mx-auto">
              {/* Icon */}
              <div className="mx-auto mb-6 p-4 rounded-full bg-primary/20 w-fit">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Create Something Amazing?
              </h2>

              {/* Description */}
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already using Dreamy Studio to bring their ideas to life. 
                Start generating stunning AI images today.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link to="/signup">
                  <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                    Start Creating Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10"
                  onClick={() => scrollToSection('pricing')}
                >
                  <Zap className="mr-2 w-5 h-5" />
                  View Pricing
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  No credit card required
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Free forever plan available
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Cancel anytime
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
