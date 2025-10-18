import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Star, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export const Pricing = () => {
  // Credit packs replace subscription plans.
  // Each pack contains a number of credits, an optional bonus,
  // and a clear price. CTA links to billing/credits purchase flow.
  const packs = [
    {
      name: "Starter Pack",
      credits: 50,
      bonus: 0,
      price: "$10",
      pricePerCredit: "0.20",
      description: "Perfect to try Dreamy Studio and generate a handful of images.",
      features: [
        "50 credits",
        "Access to basic models",
        "Standard resolution",
        "Use for text-to-image & image-to-image",
      ],
      cta: "Buy 50 Credits",
      popular: false,
      href: "/signup",
    },
    {
      name: "Creator Pack",
      credits: 300,
      bonus: 30,
      price: "$25",
      pricePerCredit: "0.08",
      description:
        "For hobbyists and creators who generate regularly. Includes bonus credits.",
      features: [
        "300 credits + 30 bonus",
        "Access to all standard models",
        "High resolution available",
        "Faster generation queue",
      ],
      cta: "Buy 330 Credits",
      popular: true,
      href: "/signup",
    },
    {
      name: "Studio Pack",
      credits: 1200,
      bonus: 300,
      price: "$80",
      pricePerCredit: "0.05",
      description:
        "Best value for pros and small teams who need lots of credits.",
      features: [
        "1200 credits + 300 bonus",
        "All models & highest resolutions",
        "Priority support",
        "Batch generation & API access",
      ],
      cta: "Buy 1500 Credits",
      popular: false,
      href: "/contact",
    },
  ];

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
            Buy Credits — Pay only for what you use
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto px-4">
            Buy credits and spend them per generation. Unused credits remain in your account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {packs.map((pack, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-300 hover:shadow-xl ${
                pack.popular ? "shadow-lg md:scale-105" : ""
              }`}
              style={{
                border: "1px solid transparent",
                backgroundImage: pack.popular
                  ? `
                    linear-gradient(to bottom, rgba(10, 10, 10, 1), rgba(10, 10, 10, 0.9)),
                    linear-gradient(to bottom, rgba(164, 143, 255, 0.4), rgba(164, 143, 255, 0.9))
                  `
                  : undefined,
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              {pack.popular && (
                <Badge className="absolute -top-2.5 sm:-top-3 left-1/2 transform -translate-x-1/2 text-white font-semibold text-xs sm:text-sm">
                  <Star className="w-3 h-3 mr-1" />
                  Best Value
                </Badge>
              )}

              <CardHeader className="text-center pb-3 sm:pb-4 pt-6 sm:pt-6">
                <div className="flex items-center justify-center gap-2">
                  <CardTitle className="text-xl sm:text-2xl text-white">
                    {pack.name}
                  </CardTitle>
                </div>

                <div className="mt-3 sm:mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {pack.price}
                  </span>
                  <span className="text-sm sm:text-base text-slate-300"> / one-time</span>
                </div>

                <CardDescription className="mt-2 text-sm sm:text-base text-slate-300 px-2">
                  {pack.description}
                </CardDescription>

                <div className="mt-3 text-sm text-slate-300">
                  <span className="font-semibold text-white">{pack.credits}</span>
                  <span className="ml-1">credits</span>
                  {pack.bonus ? (
                    <span className="ml-2 text-emerald-300">+ {pack.bonus} bonus</span>
                  ) : null}
                  <div className="mt-1 text-xs text-slate-400">
                    Approx. ${pack.pricePerCredit} / credit
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                <ul className="space-y-2 sm:space-y-3">
                  {pack.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-4 h-4 text-purple-300 mr-3 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={pack.href} className="block">
                  <Button
                    className={`w-full text-sm sm:text-base flex items-center justify-center gap-2 ${
                      pack.popular
                        ? "text-black font-semibold"
                        : "bg-slate-700 hover:bg-slate-600 text-white"
                    }`}
                    size="lg"
                    style={
                      pack.popular
                        ? {
                            background:
                              "linear-gradient(135deg, #E0B0FF 0%, #ADD8E6 50%, #FFC0CB 100%)",
                            border: "none",
                          }
                        : {}
                    }
                  >
                    <CreditCard className="w-4 h-4" />
                    {pack.cta}
                  </Button>
                </Link>

                <div className="text-xs text-slate-400 text-center">
                  Credits do not expire. Pricing shown is in USD. Taxes may apply.
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 lg:mt-12 px-4">
          <p className="text-sm sm:text-base text-slate-300 mb-3 sm:mb-4">
            How credits work: Each image generation consumes credits depending on the model,
            resolution, and features used (image-to-image, upscaling, etc.). You can check cost
            estimates before generating in the app.
          </p>
          <p className="text-xs sm:text-sm text-slate-300">
            Need help or a custom pack for teams?{" "}
            <Link to="/contact" className="text-purple-300 hover:underline">
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
