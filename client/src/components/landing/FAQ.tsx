import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "How does AI image generation work?",
      answer: "Our platform uses state-of-the-art AI models like Flux, Recraft, and Ideogram to generate images from text prompts. Simply describe what you want to create, and our AI will generate high-quality images in seconds."
    },
    {
      question: "What image formats and resolutions do you support?",
      answer: "We support multiple formats including PNG, JPEG, and WebP. Resolutions range from standard (512x512) to high-resolution (4K) depending on your plan. Pro users get access to 4K generation."
    },
    {
      question: "Can I use the generated images commercially?",
      answer: "Yes! All images generated through our platform can be used for commercial purposes. You own the rights to images you create with our service."
    },
    {
      question: "How many images can I generate per day?",
      answer: "Free users can generate 5 images per day. Pro users get 500 images per month, and Enterprise users have unlimited generation. You can always upgrade your plan for more capacity."
    },
    {
      question: "What AI models are available?",
      answer: "We offer 10+ AI models including Flux Dev/Schnell, Recraft V3, Ideogram V2/V3, and specialized models for different styles and use cases. Pro users get access to all models."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. We use enterprise-grade encryption for all data transmission and storage. Your prompts and generated images are private and never shared with third parties."
    },
    {
      question: "Do you offer API access?",
      answer: "Yes! Pro and Enterprise users get API access to integrate our AI image generation into their own applications and workflows."
    },
    {
      question: "What if I'm not satisfied with the results?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not completely satisfied, contact our support team for a full refund."
    },
    {
      question: "Can I edit existing images with AI?",
      answer: "Yes! Our Image-to-Image feature allows you to transform existing images using AI. Upload an image and describe how you want to modify it."
    },
    {
      question: "How do I get started?",
      answer: "Simply sign up for a free account and start generating images immediately. No credit card required for the free plan. You can upgrade anytime as your needs grow."
    }
  ];

  return (
    <section id="faq" className="py-20 px-4 relative"> 
      <div className="container mx-auto max-w-4xl relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-300">
            Everything you need to know about Dreamy Studio
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="backdrop-blur-sm rounded-lg px-6"
              style={{
                border: "1px solid transparent",
                backgroundImage: `
                  linear-gradient(to bottom, rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 0.8)),
                  linear-gradient(135deg, rgb(168 85 247 / 0.2), rgb(59 130 246 / 0.2), rgb(147 197 253 / 0.2))
                `,
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-medium text-white">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-slate-300 mb-4">
            Still have questions?
          </p>
          <a 
            href="mailto:support@dreamystudio.com" 
            className="text-purple-300 hover:underline font-medium"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
};
