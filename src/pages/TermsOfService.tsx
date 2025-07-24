import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, AlertTriangle, Scale } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TermsOfService = () => {
  const heroRef = useScrollAnimation();
  const contentRef = useScrollAnimation();

  const sections = [
    {
      icon: CheckCircle,
      title: "Acceptance of Terms",
      content: "By using XenoraAI services, you agree to these terms and conditions. These terms govern your access to and use of our AI-powered legal solutions, including our website, applications, and any related services we provide."
    },
    {
      icon: FileText,
      title: "Use of Services",
      content: "Our services are designed to assist with legal research and document analysis. You may use our services for lawful purposes only and in accordance with these terms. You are responsible for maintaining the confidentiality of your account credentials."
    },
    {
      icon: AlertTriangle,
      title: "User Responsibilities",
      content: "You agree to use our services responsibly and not to engage in any activities that could harm our platform or other users. This includes not attempting to reverse engineer our AI models or use our services for illegal activities."
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: "XenoraAI is not liable for indirect, incidental, or consequential damages arising from service use. Our AI tools are designed to assist legal professionals but do not replace professional legal judgment and advice."
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
            <FileText className="h-3 w-3 mr-1" />
            Terms of Service
          </Badge>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these terms carefully before using XenoraAI's legal AI solutions and services.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Terms Content */}
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

            {/* Legal Notice */}
            <Card className="bg-primary-gradient border-0">
              <CardContent className="p-8 text-center text-white">
                <h3 className="text-xl font-semibold mb-4">Questions About These Terms?</h3>
                <p className="mb-6 text-white/90">
                  If you have any questions about these Terms of Service, please contact our legal team.
                </p>
                <p className="text-white/90">
                  Email: <span className="font-semibold">legal@xenoraai.com</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;