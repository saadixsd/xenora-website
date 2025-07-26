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
      title: "1. Acceptance and Scope",
      content: "By accessing or using XenoraAI services, you agree to be bound by these Terms of Service. These terms apply to: • All XenoraAI software and services • Nora AI Assistant and Halo Legal Suite • API access and integrations • Support and consulting services • Any future products or features we may release"
    },
    {
      icon: FileText,
      title: "2. Permitted Use and Restrictions",
      content: "You may use our services for lawful legal purposes only. Prohibited activities include: • Reverse engineering or copying our AI models • Sharing account credentials with unauthorized users • Using services for illegal or unethical purposes • Attempting to breach security or access controls • Violating applicable laws or professional conduct rules • Interfering with service operation or other users"
    },
    {
      icon: AlertTriangle,
      title: "3. Professional Responsibility",
      content: "While our AI tools provide sophisticated assistance, users maintain full professional responsibility for: • All legal advice and decisions • Compliance with professional conduct rules • Client confidentiality and privilege protection • Accuracy of any work product • Meeting all applicable deadlines and requirements • Supervising any AI-generated content or recommendations"
    },
    {
      icon: Scale,
      title: "4. Disclaimers and Limitations",
      content: "XenoraAI services are provided 'as is' without warranties. Our liability is limited to: • The amount paid for services in the preceding 12 months • Direct damages only (no indirect, consequential, or punitive damages) • Reasonable efforts to maintain service availability • Professional indemnity insurance coverage • Compliance with applicable professional liability standards"
    }
  ];

  return (
    <div className="min-h-screen pt-16 page-fade-in">
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