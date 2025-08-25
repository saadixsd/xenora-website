import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Clock, 
  FileText, 
  Scale, 
  Search, 
  Languages,
  CheckCircle, 
  ArrowRight,
  Zap,
  Globe,
  Users,
  Database,
  BookOpen,
  Gavel,
  Building
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTranslation } from 'react-i18next';
import NoraDemo from "@/components/NoraDemo";

const Nora = () => {
  const heroRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();
  const useCasesRef = useScrollAnimation();
  const { t } = useTranslation();
  const specsRef = useScrollAnimation();
  const features = [
    "Legal Q&A with citations from Canadian federal and provincial case law",
    "Document upload and parsing (PDF, DOCX, TXT) with clause extraction",
    "Contract summarization with key terms and obligations highlighted",
    "Context-aware prompting for lawyers, judges, or clients",
    "Meeting notes summarization and smart task reminders",
    "Real-time Retrieval-Augmented Generation (RAG) for legal knowledge search",
    "Personalized responses with long-term user memory",
    "Multilingual support for English and French legal documents",
    "Compliance with PIPEDA and SOC2 for data security"
  ];

  const useCases = [
    {
      icon: Gavel,
      title: "Legal Research & Analysis",
      description: "Instantly research Canadian case law, statutes, and regulations with precise citations and contextual analysis across federal and provincial jurisdictions.",
      highlight: "10M+ legal documents"
    },
    {
      icon: FileText,
      title: "Contract Intelligence",
      description: "Advanced document analysis for contracts, agreements, and legal instruments with clause extraction and risk assessment capabilities.",
      highlight: "99% accuracy rate"
    },
    {
      icon: Building,
      title: "Corporate Compliance",
      description: "Navigate complex regulatory frameworks across Canadian provinces with real-time compliance monitoring and advisory services.",
      highlight: "Multi-jurisdictional expertise"
    },
    {
      icon: BookOpen,
      title: "Legal Education",
      description: "Comprehensive explanations of Canadian legal principles, procedures, and precedents for professionals and students alike.",
      highlight: "Bilingual EN/FR support"
    }
  ];

  const specifications = [
    {
      icon: Database,
      title: "Canadian Legal Database",
      description: "Trained on comprehensive Canadian and provincial legal data with RAG-enabled search.",
      metric: "10M+ Cases"
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "Optimized for speed and accuracy in a high-performance environment.",
      metric: "< 5 seconds"
    },
    {
      icon: Languages,
      title: "Legal Intelligence",
      description: "Specialized in legal Q&A, document analysis, and task automation for Canadian law.",
      metric: "EN/FR Support"
    },
    {
      icon: Shield,
      title: "Compliance",
      description: "Adheres to Canadian data protection and security standards.",
      metric: "PIPEDA, SOC2"
    },
    {
      icon: Globe,
      title: "Integration",
      description: "Integrates with legal management software and APIs for streamlined workflows.",
      metric: "Seamless API"
    },
    {
      icon: Scale,
      title: "Scalability",
      description: "Supports firms of all sizes with scalable, cloud-based infrastructure.",
      metric: "Cloud-Based"
    }
  ];

  return (
    <div className="min-h-screen page-fade-in">
      {/* Header */}
      <section className="pt-16 pb-8 bg-hero-gradient shadow-elegant">
        <div 
          ref={heroRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${heroRef.isVisible ? 'visible' : ''}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-swoosh-in">
              <Badge variant="outline" className="w-fit hover-scale bg-primary/10 border-primary/30">
                <Scale className="h-3 w-3 mr-1 text-primary" />
                Canadian Legal AI
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight animate-fade-in-up">
                  <span className="bg-primary-gradient bg-clip-text text-transparent">Nora</span>
                  <br />
                  <span className="text-3xl lg:text-4xl font-normal text-muted-foreground">Legal Intelligence</span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl">
                  Advanced AI legal assistant specializing in Canadian federal and provincial law. 
                  Empowering lawyers, firms, and legal professionals with instant access to comprehensive legal knowledge.
                </p>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span>Live AI Powered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <span>Canadian Law Specialized</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-primary-gradient hover:shadow-glow transition-all duration-300">
                  <Link to="/login">
                    Try Nora Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Schedule Demo</Link>
                </Button>
              </div>
            </div>

            {/* Live Demo Interface */}
            <div className="lg:max-w-xl">
              <NoraDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-swoosh section-padding bg-background">
        <div 
          ref={featuresRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${featuresRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              <span className="bg-primary-gradient bg-clip-text text-transparent">Advanced</span> Legal Capabilities
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive AI-powered tools designed specifically for Canadian legal practice, research, and compliance.
            </p>
          </div>

          <Card className="bg-card-gradient border-primary/10 hover-lift">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>Everything you need for intelligent legal assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-swoosh section-padding bg-accent/5">
        <div 
          ref={useCasesRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${useCasesRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Professional <span className="bg-primary-gradient bg-clip-text text-transparent">Applications</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforming legal practice across Canada with specialized AI solutions for law firms, corporate legal departments, and government agencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center hover-scale">
                      <useCase.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{useCase.title}</h3>
                      <Badge variant="outline" className="mt-1">{useCase.highlight}</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="section-swoosh section-padding bg-background">
        <div 
          ref={specsRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${specsRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              <span className="bg-primary-gradient bg-clip-text text-transparent">Enterprise-Grade</span> Infrastructure
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built on cutting-edge AI technology with robust security, compliance, and scalability for Canadian legal professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specifications.map((spec, index) => (
              <Card key={index} className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 hover-scale">
                    <spec.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{spec.title}</h3>
                  <Badge variant="outline" className="mb-4">{spec.metric}</Badge>
                  <p className="text-muted-foreground text-sm">{spec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="section-padding bg-primary-gradient shadow-elegant">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to Experience Nora?</h2>
          <div className="space-y-6 animate-scale-in">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-white">Nora AI Assistant</span>
            </div>
            
            <div className="space-y-4">
              <div className="text-4xl font-bold text-white">Starting at $9.99/month</div>
              <p className="text-white/80">
                Professional-grade Canadian legal AI accessible to firms of all sizes
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover-scale" asChild>
                <Link to="/login">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white hover-scale" asChild>
                <Link to="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nora;