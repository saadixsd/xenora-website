import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Bot,
  Shield, 
  Clock, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Scale,
  FileText,
  Calendar,
  DollarSign,
  Building
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import XenoraLogo from "@/components/XenoraLogo";
import ScheduleDemoButton from "@/components/ScheduleDemoButton";

const Models = () => {
  const heroRef = useScrollAnimation();
  const modelsRef = useScrollAnimation();
  const useCasesRef = useScrollAnimation();
  
  const noraFeatures = [
    "Legal Q&A with Canadian case law citations",
    "Document upload and parsing (PDF, DOCX, TXT)",
    "Contract summarization and clause extraction",
    "Context-aware prompting for lawyers, judges, or clients",
    "Meeting notes summarization and smart task reminders",
    "Real-time RAG-enabled legal knowledge search",
    "Personalized responses with long-term user memory"
  ];

  const haloFeatures = [
    "Case and client management system powered by Nora",
    "Secure document vault with tagging and versioning",
    "Smart calendar with legal deadlines and task scheduling",
    "Billing and invoicing with automated time tracking",
    "Client portal for appointments and invoice access",
    "Integration with Google Drive and Office365",
    "Role-based access controls for team management"
  ];

  const useCases = [
    {
      icon: Scale,
      title: "Case Management",
      description: "Halo enables lawyers to track cases and clients with Nora-powered insights.",
      models: ["Halo"]
    },
    {
      icon: DollarSign,
      title: "Billing & Invoicing",
      description: "Halo's billing dashboard, powered by Nora's time tracking, streamlines invoicing.",
      models: ["Halo", "Nora"]
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Paralegals use Halo's calendar with Nora's task automation for efficient scheduling.",
      models: ["Halo", "Nora"]
    },
    {
      icon: Users,
      title: "Client Portal",
      description: "Clients access invoices and book appointments securely via Halo's portal.",
      models: ["Halo"]
    },
    {
      icon: FileText,
      title: "Document Analysis",
      description: "Nora parses contracts and legal documents, extracting key clauses and summarizing content.",
      models: ["Nora"]
    },
    {
      icon: Building,
      title: "Team Collaboration",
      description: "Halo's role-based access controls enable secure team collaboration.",
      models: ["Halo"]
    }
  ];

  return (
    <div className="min-h-screen pt-16 page-fade-in">
      {/* Header */}
      <section className="section-padding bg-hero-gradient shadow-elegant">
        <div 
          ref={heroRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-animate ${heroRef.isVisible ? 'visible' : ''}`}
        >
          <Badge variant="outline" className="mb-4 hover-scale">
            <Sparkles className="h-3 w-3 mr-1" />
            Product Showcase
          </Badge>
          <h1 className="text-5xl font-bold text-foreground mb-6 animate-fade-in-up">
            Intelligent Legal AI Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover our cutting-edge AI models designed specifically for Canadian legal professionals.
            From intelligent research to complete practice management.
          </p>
          <ScheduleDemoButton size="lg" className="animate-scale-in" />
        </div>
      </section>

      {/* Models Section */}
      <section className="section-swoosh section-padding bg-background">
        <div 
          ref={modelsRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${modelsRef.isVisible ? 'visible' : ''}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Nora */}
            <Card className="bg-card-gradient border-primary/10 hover-lift hover:shadow-primary transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 hover-scale">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground">Nora</CardTitle>
                <p className="text-muted-foreground">
                  Canada's smartest legal AI assistant, powering intelligent legal research, 
                  document analysis, and task automation.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Key Features</h4>
                  <ul className="space-y-3">
                    {noraFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <Button asChild className="w-full bg-primary-gradient hover:shadow-glow transition-all duration-300">
                    <Link to="/nora">
                      Learn More About Nora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    Demo Coming Soon
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Halo */}
            <Card className="bg-card-gradient border-primary/10 hover-lift hover:shadow-primary transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 hover-scale">
                  <Building className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground">Halo</CardTitle>
                <p className="text-muted-foreground">
                  The AI-powered legal operating suite, embedding Nora's intelligence into case management, 
                  billing, scheduling & many other tasks.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Key Features</h4>
                  <ul className="space-y-3">
                    {haloFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <Button asChild className="w-full bg-primary-gradient hover:shadow-glow transition-all duration-300">
                    <Link to="/halo">
                      Learn More About Halo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    Launching August 2025
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-swoosh section-padding bg-accent/30">
        <div 
          ref={useCasesRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${useCasesRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Real-World Applications
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how Nora and Halo transform legal workflows for various professionals 
              in Canadian law firms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 hover-scale">
                    <useCase.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-4">{useCase.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.models.map((model) => (
                      <Badge key={model} variant="outline" className="text-xs hover-scale">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Technical Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built with cutting-edge technology and designed for Canadian legal compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4 hover-scale">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto hover:bg-primary/20 transition-colors">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Canadian Legal Database</h3>
              <p className="text-muted-foreground">Trained on comprehensive Canadian and provincial legal data with AI-enabled search.</p>
            </div>

            <div className="text-center space-y-4 hover-scale">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto hover:bg-primary/20 transition-colors">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Response &lt; 5s</h3>
              <p className="text-muted-foreground">Optimized for speed and accuracy in a high-performance environment.</p>
            </div>

            <div className="text-center space-y-4 hover-scale">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto hover:bg-primary/20 transition-colors">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">PIPEDA, SOC2</h3>
              <p className="text-muted-foreground">Adheres to Canadian data protection and security standards.</p>
            </div>

            <div className="text-center space-y-4 hover-scale">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto hover:bg-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Cloud-Based</h3>
              <p className="text-muted-foreground">Supports firms of all sizes with scalable, cloud-based infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-scale-in">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Experience the Future of Legal AI?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join the waitlist and be among the first to access Nora and Halo when they launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="hover-scale">
                <Link to="/login">
                  Join Waitlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover-scale" asChild>
                <Link to="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Models;