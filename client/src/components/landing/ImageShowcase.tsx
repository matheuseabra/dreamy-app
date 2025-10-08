import generated1 from "@/assets/generated-1.jpg";
import generated2 from "@/assets/generated-2.jpg";
import generated3 from "@/assets/generated-3.jpg";
import generated4 from "@/assets/generated-4.jpg";
import generated5 from "@/assets/generated-5.jpg";



export const ImageShowcase = () => {
  return (
    <section className="py-20 px-4 relative">
      {/* Purple Radial Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 700px at 50% 500px, rgba(92, 105, 246, 0.34), transparent)`,
        }}
      />
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See What's Possible
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Explore stunning examples of AI-generated art created with our platform
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-3 h-[500px]">
            {/* Top Left - Square */}
            <div className="rounded-lg overflow-hidden col-span-1">
              <img 
                src={generated1} 
                alt="AI Generated Image 1" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Top Center - Square */}
            <div className="rounded-lg overflow-hidden col-span-1">
              <img 
                src={generated2} 
                alt="AI Generated Image 2" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Top Right - Tall Rectangle (spans 2 rows) */}
            <div className="rounded-lg overflow-hidden col-span-1 row-span-2">
              <img 
                src={generated3} 
                alt="AI Generated Image 3" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Bottom Left - Rectangle */}
            <div className="rounded-lg overflow-hidden col-span-1">
              <img 
                src={generated4} 
                alt="AI Generated Image 4" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Bottom Center - Square */}
            <div className="rounded-lg overflow-hidden col-span-1">
              <img 
                src={generated5} 
                alt="AI Generated Image 5" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
