import { CTA } from "./landing/CTA";
import { FAQ } from "./landing/FAQ";
import { Features } from "./landing/Features";
import { Footer } from "./landing/Footer";
import { Hero } from "./landing/Hero";
import { Navbar } from "./landing/Navbar";
import { Pricing } from "./landing/Pricing";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        {/* <AIModelsShowcase /> */}
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};
