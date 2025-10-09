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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Choose the plan that fits your creative needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'shadow-lg scale-105' 
                  : ''
              }`}
              style={{
                border: "1px solid transparent",
                backgroundImage: plan.popular 
                  ? `
                    linear-gradient(to bottom, rgba(10, 10, 10, 1), rgba(10, 10, 10, 0.8)),
                    linear-gradient(to bottom, rgba(164, 143, 255, 0.5), rgba(164, 143, 255, 1))
                  `
                  : `
                    linear-gradient(to bottom, rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 0.8)),
                    linear-gradient(to bottom, rgb(224 187 228 / 0.3), rgb(160 196 255 / 0.3))
                  `,
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              {plan.popular && (
                <Badge 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-white font-semibold"
                  style={{
                    background: "linear-gradient(135deg, rgb(59 130 246), rgb(168 85 247))",
                    border: "1px solid transparent",
                    backgroundImage: `
                      linear-gradient(to bottom, rgb(59 130 246), rgb(168 85 247)),
                      linear-gradient(135deg, rgb(168 85 247), rgb(59 130 246), rgb(147 197 253))
                    `,
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                  }}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-slate-300">/{plan.period}</span>
                  )}
                </div>
                <CardDescription className="mt-2 text-slate-300">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-4 h-4 text-purple-300 mr-3 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.href} className="block">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'text-black font-semibold' 
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                    size="lg"
                    style={plan.popular ? {
                      background: "linear-gradient(135deg, #E0B0FF 0%, #ADD8E6 50%, #FFC0CB 100%)",
                      border: "none",
                    } : {}}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-300 mb-4">
            All plans include our core features and 24/7 support
          </p>
          <p className="text-sm text-slate-300">
            Need a custom plan? <Link to="/contact" className="text-purple-300 hover:underline">Contact our sales team</Link>
          </p>
        </div>
      </div>
    </section>
  );
};
