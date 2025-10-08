export const ImageShowcase = () => {
  return (
    <section className="py-20 px-4 relative">
      {/* Purple Radial Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 700px at 50% 500px, rgba(139, 92, 246, 0.34), transparent)`,
        }}
      />
      <div className="container mx-auto relative z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See What's Possible
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Explore stunning examples of AI-generated art created with our platform
          </p>
        </div>
      </div>
    </section>
  );
};
