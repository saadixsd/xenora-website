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
      title: "1. Information We Collect",
      content: "We collect information you provide directly when registering for our services, including: • Personal identifiers (name, email, phone) • Professional information (law firm, practice area) • Account credentials and billing information • Documents and content you upload for AI analysis • Usage data and interaction patterns with our AI models"
    },
    {
      icon: FileText,
      title: "2. How We Use Your Information",
      content: "Your information enables us to: • Provide and improve our AI legal services • Process your legal document analysis requests • Communicate important updates and features • Ensure platform security and prevent fraud • Comply with legal obligations and regulatory requirements • Personalize your experience based on usage patterns"
    },
    {
      icon: Lock,
      title: "3. Information Sharing and Disclosure",
      content: "We do not sell your personal information. We may share information only when: • You provide explicit consent • Required by law or legal process • Necessary to protect our rights or safety • With trusted service providers under strict confidentiality agreements • During business transfers (mergers, acquisitions) with continued privacy protection"
    },
    {
      icon: Shield,
      title: "4. Data Security and Retention",
      content: "We implement comprehensive security measures: • End-to-end encryption for all data transmission • PIPEDA and SOC2 compliance standards • Regular security audits and penetration testing • Secure data centers with physical access controls • Data retention policies aligned with legal requirements • Right to request data deletion upon account termination"
    }
  ];

  return (
    <div className="min-h-screen pt-16 page-fade-in">
      {/* Header */}
      <section className="relative overflow-hidden bg-hero-gradient section-padding shadow-elegant">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent animate-pulse" />
        <div 
          ref={heroRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${
            heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Badge variant="outline" className="mb-8 hover-scale border-primary/30 bg-primary/5">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-lg font-medium">Privacy Policy</span>
          </Badge>
          <h1 className="text-7xl font-bold text-foreground mb-8 animate-fade-in-up">
            Your <span className="bg-primary-gradient bg-clip-text text-transparent">Privacy</span> Matters
          </h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-4">
            Learn how XenoraAI protects and manages your personal information with transparency and care.
          </p>
          <p className="text-lg text-muted-foreground opacity-80">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="section-padding section-swoosh bg-accent/5">
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
            <Card className="bg-primary-gradient border-0 shadow-elegant hover-lift">
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