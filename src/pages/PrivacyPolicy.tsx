import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PrivacyPolicy = () => {
  const heroRef = useScrollAnimation();
  const contentRef = useScrollAnimation();

  const sections = [
    {
      icon: Eye,
      title: "Introduction",
      content: "At XenoraAI, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered legal solutions and services."
    },
    {
      icon: FileText,
      title: "Data Collection",
      content: "We collect information you provide directly, such as your name, email address, and company information when you register for our services. We also collect usage data through cookies and similar technologies to improve your experience with our platform."
    },
    {
      icon: Lock,
      title: "Data Usage",
      content: "Your information is used to provide and improve our services, communicate with you about updates and features, and ensure the security and functionality of our platform. We never sell your personal information to third parties."
    },
    {
      icon: Shield,
      title: "Data Protection",
      content: "We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. Our team is trained in data protection best practices and privacy regulations."
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
            <Shield className="h-3 w-3 mr-1" />
            Privacy Policy
          </Badge>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Your Privacy Matters
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn how XenoraAI protects and manages your personal information with transparency and care.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="section-padding section-swoosh bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={contentRef.ref}
            className={`space-y-8 transition-all duration-700 ${
              contentRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {sections.map((section, index) => (
              <Card key={index} className="bg-card-gradient border-primary/10 hover:shadow-elegant hover-lift transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">{section.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Contact Information */}
            <Card className="bg-primary-gradient border-0">
              <CardContent className="p-8 text-center text-white">
                <h3 className="text-xl font-semibold mb-4">Questions About Privacy?</h3>
                <p className="mb-6 text-white/90">
                  If you have any questions about this Privacy Policy or our data practices, please contact us.
                </p>
                <p className="text-white/90">
                  Email: <span className="font-semibold">privacy@xenoraai.com</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;