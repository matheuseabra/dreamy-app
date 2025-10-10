import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const features = [
  {
    category: "For Creators",
    title: "Create production-quality visual assets",
    details:
      "Generate stunning visual content for your projects with unprecedented quality, speed, and style-consistency. From concept art to marketing materials, bring your creative vision to life with our advanced AI models.",
    tutorialLink: "#",
  },
  {
    category: "For Teams",
    title: "Bring your team's best ideas to life at scale",
    details:
      "Collaborate seamlessly with our intuitive AI-first creative suite designed for teamwork and built for business. Share galleries, manage projects, and maintain brand consistency across all your creative outputs.",
    tutorialLink: "#",
  },
  {
    category: "For Developers",
    title: "Experience content creation excellence with our API",
    details:
      "Integrate powerful AI image generation into your applications with unmatched scalability. Effortlessly tailor outputs to your brand guidelines and create custom workflows that fit your development needs.",
    tutorialLink: "#",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 px-4">
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-6xl w-full py-10 px-6">
          <h2 className="text-4xl md:text-[2.75rem] md:leading-[1.2] font-semibold tracking-[-0.03em] sm:max-w-xl text-pretty sm:mx-auto sm:text-center text-white">
            Creativity, Unleashed.
          </h2>
          <p className="mt-2 text-slate-300 text-lg sm:text-xl sm:text-center">
            Leverage generative AI with a unique suite of tools to convey your ideas to the world.
          </p>
          <div className="mt-8 md:mt-16 w-full mx-auto space-y-20">
            {features.map((feature) => (
              <div
                key={feature.category}
                className="flex flex-col md:flex-row items-center gap-x-12 gap-y-6 md:even:flex-row-reverse"
              >
                <div className="w-full aspect-[4/3] bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 basis-1/2" />
                <div className="basis-1/2 shrink-0">
                  <span className="uppercase font-medium text-sm text-slate-400">
                    {feature.category}
                  </span>
                  <h4 className="my-3 text-2xl font-semibold tracking-tight text-white">
                    {feature.title}
                  </h4>
                  <p className="text-slate-300">{feature.details}</p>
                  <Button variant="outline" size="lg" className="mt-6 rounded-full gap-3 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/70">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
