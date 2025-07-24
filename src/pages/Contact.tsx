import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MapPin, 
  Clock, 
  Linkedin, 
  Twitter, 
  Send,
  Phone,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const heroRef = useScrollAnimation();
  const formRef = useScrollAnimation();
  const faqRef = useScrollAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });
    }, 2000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      subtitle: "Primary",
      content: "xenoraai@gmail.com",
      description: "Response within 24 hours",
      action: "mailto:xenoraai@gmail.com?subject=Inquiry%20from%20XenoraAI%20Website&body=Hello%20XenoraAI%20Team,"
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      subtitle: "Professional",
      content: "Connect with XenoraAI",
      description: "Follow us for updates and industry insights",
      action: "https://www.linkedin.com/company/xenoraai/"
    },
    {
      icon: Twitter,
      title: "X (Twitter)",
      subtitle: "News",
      content: "@XenoraAI",
      description: "Latest updates, announcements, and AI insights",
      action: "https://x.com/XenoraAI"
    },
    {
      icon: MapPin,
      title: "Our Location",
      subtitle: "Office",
      content: "Montreal, Quebec, Canada",
      description: "Timezone: Eastern Standard Time (EST)",
      action: null
    }
  ];

  return (
    <div className="min-h-screen pt-20 page-fade-in">
      {/* Header */}
      <section className="section-padding bg-hero-gradient">
        <div 
          ref={heroRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${
            heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Badge variant="outline" className="mb-4">
            <Mail className="h-3 w-3 mr-1" />
            Get in Touch
          </Badge>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Contact XenoraAI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to transform your legal practice? Have questions about our AI solutions? 
            We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding section-swoosh bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={formRef.ref}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 transition-all duration-700 ${
              formRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Contact Form */}
            <Card className="bg-card-gradient border-primary/10 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      placeholder="Your Law Firm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Inquiry about Nora AI Assistant"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your needs and how we can help..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary-gradient hover:shadow-glow transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Other Ways to Connect</h2>
                <p className="text-muted-foreground text-lg">
                  Choose the method that works best for you. We're here to help and answer any questions 
                  about our AI solutions.
                </p>
              </div>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="bg-card-gradient border-primary/10 hover:shadow-elegant transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <method.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-foreground">{method.title}</h3>
                            <Badge variant="outline" className="text-xs">{method.subtitle}</Badge>
                          </div>
                          <p className="text-primary font-medium mb-1">{method.content}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          {method.action && (
                            <Button variant="outline" size="sm" className="mt-3" asChild>
                              <a 
                                href={method.action} 
                                target={method.action.startsWith('http') ? '_blank' : undefined}
                                rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                              >
                                Connect
                                <ArrowRight className="ml-2 h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Waitlist CTA */}
              <Card className="bg-primary-gradient border-0">
                <CardContent className="p-8 text-center text-white">
                  <h3 className="text-xl font-semibold mb-4">Join Our Waitlist</h3>
                  <p className="mb-6 text-white/90">
                    Interested in our Nora or Halo models? Be among the first to experience 
                    our latest AI innovations.
                  </p>
                  <Button variant="secondary" size="lg">
                    Join Waitlist Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding section-swoosh bg-accent/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            ref={faqRef.ref}
            className={`transition-all duration-700 ${
              faqRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">How quickly will I hear back?</h3>
              <p className="text-muted-foreground">We typically respond to all inquiries within 24 hours during business days.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">Can I schedule a demo?</h3>
              <p className="text-muted-foreground">Absolutely! Mention demo interest in your message and we'll arrange a personalized session.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">Do you offer enterprise solutions?</h3>
              <p className="text-muted-foreground">Yes, we provide custom enterprise solutions with dedicated support and integrations.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">What about data security?</h3>
              <p className="text-muted-foreground">We're PIPEDA and SOC2 compliant, ensuring the highest standards of data protection.</p>
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;