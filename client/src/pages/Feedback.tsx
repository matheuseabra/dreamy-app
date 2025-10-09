import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bug, Lightbulb, MessageSquare, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    rating: "",
    category: "",
    title: "",
    description: "",
    suggestions: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.type || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would typically send the feedback to your backend
    toast.success("Thank you for your feedback! We appreciate your input and will review it carefully.");
    setFormData({
      name: "",
      email: "",
      type: "",
      rating: "",
      category: "",
      title: "",
      description: "",
      suggestions: "",
    });
  };

  const feedbackTypes = [
    { value: "feature", label: "Feature Request", icon: Lightbulb, description: "Suggest a new feature or improvement" },
    { value: "bug", label: "Bug Report", icon: Bug, description: "Report a problem or issue" },
    { value: "general", label: "General Feedback", icon: MessageSquare, description: "Share your thoughts and opinions" },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Feedback & Suggestions
          </h1>
          <p className="text-muted-foreground">
            Help us improve Dreamy Studio by sharing your thoughts and suggestions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Feedback</CardTitle>
              <CardDescription>
                Your input helps us make Dreamy Studio better for everyone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Feedback Type */}
                <div>
                  <Label className="text-base font-medium">What type of feedback is this? *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    {feedbackTypes.map((type) => (
                      <Card 
                        key={type.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          formData.type === type.value 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleInputChange("type", type.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <type.icon className="h-5 w-5 text-primary" />
                            <div>
                              <h4 className="font-medium">{type.label}</h4>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                {formData.type && (
                  <div>
                    <Label className="text-base font-medium">How would you rate your overall experience? *</Label>
                    <RadioGroup 
                      value={formData.rating} 
                      onValueChange={(value) => handleInputChange("rating", value)}
                      className="flex gap-6 mt-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="rating-5" />
                        <Label htmlFor="rating-5" className="flex items-center gap-1 cursor-pointer">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-2">Excellent</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4" id="rating-4" />
                        <Label htmlFor="rating-4" className="flex items-center gap-1 cursor-pointer">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="ml-2">Good</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="rating-3" />
                        <Label htmlFor="rating-3" className="flex items-center gap-1 cursor-pointer">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="ml-2">Average</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="rating-2" />
                        <Label htmlFor="rating-2" className="flex items-center gap-1 cursor-pointer">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="ml-2">Poor</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="rating-1" />
                        <Label htmlFor="rating-1" className="flex items-center gap-1 cursor-pointer">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="ml-2">Very Poor</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ui-ux">User Interface & Experience</SelectItem>
                      <SelectItem value="performance">Performance & Speed</SelectItem>
                      <SelectItem value="features">Features & Functionality</SelectItem>
                      <SelectItem value="models">AI Models & Quality</SelectItem>
                      <SelectItem value="billing">Billing & Credits</SelectItem>
                      <SelectItem value="mobile">Mobile Experience</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Brief summary of your feedback"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Please provide detailed information about your feedback..."
                    rows={6}
                  />
                </div>

                {/* Suggestions */}
                <div>
                  <Label htmlFor="suggestions">Suggestions for Improvement</Label>
                  <Textarea
                    id="suggestions"
                    value={formData.suggestions}
                    onChange={(e) => handleInputChange("suggestions", e.target.value)}
                    placeholder="Any specific suggestions on how we could improve this?"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
