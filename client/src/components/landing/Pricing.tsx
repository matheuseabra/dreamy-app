import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with AI image generation",
      features: [
        "5 images per day",
        "Basic AI models",
        "Standard resolution",
        "Community support",
        "Basic gallery"
      ],
      cta: "Get Started",
      popular: false,
      href: "/signup"
    },
    {
      name: "Pro",
      price: "$19",
      period: "month",
      description: "For creators and professionals who need more power",
      features: [
        "500 images per month",
        "All AI models",
        "High resolution (4K)",
        "Priority support",
        "Advanced gallery",
        "Image to image",
        "Batch processing",
        "API access"
      ],
      cta: "Start Pro Trial",
      popular: true,
      href: "/signup"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For teams and organizations with custom needs",
      features: [
        "Unlimited images",
        "All AI models",
        "Custom resolutions",
        "Dedicated support",
        "Team collaboration",
        "Custom integrations",
        "SLA guarantee",
        "On-premise deployment"
      ],
      cta: "Contact Sales",
      popular: false,
      href: "/contact"
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your creative needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">/{plan.period}</span>
                  )}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.href} className="block">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-secondary hover:bg-secondary/90'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include our core features and 24/7 support
          </p>
          <p className="text-sm text-muted-foreground">
            Need a custom plan? <Link to="/contact" className="text-primary hover:underline">Contact our sales team</Link>
          </p>
        </div>
      </div>
    </section>
  );
};
