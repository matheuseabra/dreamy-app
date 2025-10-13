import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, BookOpen, HelpCircle, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would typically send the support request to your backend
    toast.success("Support request submitted successfully! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    });
  };

  const faqItems = [
    {
      question: "How do I generate images?",
      answer: "Go to the Generate page, enter your prompt, select a model, and click Generate. Your image will appear in your gallery once ready."
    },
    {
      question: "What AI models are available?",
      answer: "We support multiple models including Flux, Recraft, Ideogram, and more. Each model has different strengths for various types of images."
    },
    {
      question: "How do credits work?",
      answer: "Credits are used for image generation. Each generation costs a certain number of credits depending on the model and settings you choose."
    },
    {
      question: "Can I download my generated images?",
      answer: "Yes! Click on any image in your gallery to open it in full view, then use the download button to save it to your device."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach us through this support page, or email us directly at support@dreamystudio.com"
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Purple Radial Glow Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_400px_at_50%_400px,hsl(var(--primary)/0.34),transparent)]" />
      <div className="container mx-auto relative z-10">
        <div className="my-12 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="h-8 w-8" />
            Support Center
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get help with Dreamy Studio or contact our support team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Form */}
          <Card className="bg-card/50 backdrop-blur border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Mail className="h-5 w-5 text-primary" />
                Contact Support
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Send us a message and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing & Credits</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="general">General Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please provide detailed information about your issue or question..."
                    rows={6}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Support Request
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {faqItems.map((item, index) => (
                    <div 
                      key={index} 
                      className="border-l-2 border-primary/20 pl-4 hover:border-primary/40 transition-colors"
                    >
                      <h4 className="font-medium text-foreground mb-2">{item.question}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-primary/10 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    View Documentation
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-primary/10 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                    Join Community Discord
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-primary/10 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    Email: support@dreamystudio.com
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
