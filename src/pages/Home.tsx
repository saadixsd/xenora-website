import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  MapPin,
  Scale, 
  Shield, 
  FileText, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Heart,
  Search,
  Clock,
  Globe,
  Briefcase,
  Home as HomeIcon,
  Car,
  GraduationCap,
  AlertTriangle
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import XenoraLogo from "@/components/XenoraLogo";
import { useTranslation } from 'react-i18next';

const Home = () => {
  const heroRef = useScrollAnimation({ threshold: 0.1 });
  const forEveryoneRef = useScrollAnimation({ threshold: 0.3 });
  const featuresRef = useScrollAnimation({ threshold: 0.2 });
  const ctaRef = useScrollAnimation({ threshold: 0.5 });
  const { t } = useTranslation();
  
  const lifeAreas = [
    {
      icon: HomeIcon,
      title: "Housing & Tenant Rights",
      description: "Know your rights when renting, buying, or dealing with landlord disputes across Canada",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Briefcase,
      title: "Employment & Workplace",
      description: "Understand workplace rights, contracts, harassment, and wrongful dismissal protections",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Car,
      title: "Consumer & Purchase Rights",
      description: "Car purchases, warranties, returns, and protection from unfair business practices",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: Heart,
      title: "Family & Personal",
      description: "Divorce, custody, wills, healthcare directives, and personal legal matters",
      color: "bg-pink-50 text-pink-600"
    },
    {
      icon: GraduationCap,
      title: "Education & Student Rights",
      description: "Student loans, academic appeals, and educational institution disputes",
      color: "bg-orange-50 text-orange-600"
    },
    {
      icon: AlertTriangle,
      title: "Disputes & Conflicts",
      description: "Small claims, neighbour disputes, and everyday legal conflicts resolution",
      color: "bg-red-50 text-red-600"
    }
  ];

  const canadianFeatures = [
    {
      icon: MapPin,
      title: "Province-Aware Legal Guidance",
      description: "Tailored advice for Quebec's Civil Code, Ontario's legislation, BC's regulations, and all provinces"
    },
    {
      icon: FileText,
      title: "Document Explainer",
      description: "Upload any legal document - leases, contracts, terms of service - and get plain-English explanations"
    },
    {
      icon: Scale,
      title: "Know Your Rights",
      description: "Instant access to your legal rights in any situation, with links to official government resources"
    },
    {
      icon: Search,
      title: "CanLII Integration",
      description: "Search Canadian case law and legislation with AI-powered summaries and relevance scoring"
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Built for Every Canadian",
      description: "From students to seniors, renters to homeowners - legal help when you need it most"
    },
    {
      icon: Globe,
      title: "English & French",
      description: "Full bilingual support reflecting Canada's linguistic diversity and legal systems"
    },
    {
      icon: Shield,
      title: "Privacy-First & Secure",
      description: "Canadian-hosted, PIPEDA compliant, with bank-level encryption for your legal matters"
    },
    {
      icon: Clock,
      title: "Available 24/7",
      description: "Legal guidance doesn't follow business hours - access help whenever you need it"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient section-padding shadow-elegant">
        {/* Enhanced floating elements with Canadian theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 glass-strong rounded-full glass-float opacity-40 shadow-xl shadow-primary/30" style={{background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.15), rgba(255, 255, 255, 0.1))'}} />
          <div className="absolute top-40 right-16 w-24 h-24 glass-strong rounded-full glass-float-delayed opacity-50 shadow-lg shadow-primary/25" style={{background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 0, 0, 0.08))'}} />
          <div className="absolute bottom-32 left-20 w-40 h-40 glass rounded-full glass-float opacity-35 shadow-xl shadow-primary/20" style={{background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(255, 255, 255, 0.05))'}} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div 
          ref={heroRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${heroRef.isVisible ? 'visible' : ''}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-swoosh-in">
              <Badge variant="outline" className="w-fit border-primary/20 text-primary hover-scale mt-16 sm:mt-8 md:mt-0">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-lg font-medium">Made for Canadians</span>
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight pt-4 sm:pt-0">
                  Every Canadian
                  <br />
                  Deserves to
                  <br />
                  <span className="bg-primary-gradient bg-clip-text text-transparent">
                    Know Their Rights
                  </span>
                </h1>
                <p className="text-2xl text-muted-foreground max-w-lg">
                  From Montreal to Vancouver, we're making legal knowledge accessible to everyone. No law degree required.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-primary-gradient hover:shadow-glow transition-all duration-300 text-white font-semibold border-0">
                  <Link to="/for-canadians">
                    Find Your Rights
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black font-medium">
                  <Link to="/document-explainer">Try Document Explainer</Link>
                </Button>
              </div>

            </div>

            {/* Enhanced logo/visual element */}
            <div className="relative flex justify-center items-center animate-slide-up min-h-[500px]">
              {/* Canadian-themed floating background elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000" />
                <div className="absolute w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse delay-500" />
              </div>
              
              {/* Canadian legal symbols */}
              <div className="absolute inset-0 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="canadianGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#FF0000" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  
                  {/* Connection lines representing legal networks */}
                  <line x1="80" y1="100" x2="200" y2="150" stroke="url(#canadianGradient)" strokeWidth="1" className="animate-pulse" />
                  <line x1="320" y1="120" x2="200" y2="180" stroke="url(#canadianGradient)" strokeWidth="1" className="animate-pulse delay-300" />
                  <line x1="120" y1="280" x2="200" y2="220" stroke="url(#canadianGradient)" strokeWidth="1" className="animate-pulse delay-500" />
                  <line x1="280" y1="300" x2="200" y2="240" stroke="url(#canadianGradient)" strokeWidth="1" className="animate-pulse delay-700" />
                </svg>
                
                {/* Network nodes with Canadian legal concepts */}
                <div className="absolute top-[25%] left-[20%] flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                  <span className="ml-2 text-xs font-medium text-red-600/80">Rights</span>
                </div>
                <div className="absolute top-[30%] right-[20%] flex items-center justify-end">
                  <span className="mr-2 text-xs font-medium text-primary/80">Justice</span>
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse delay-300 shadow-lg shadow-primary/50" />
                </div>
                <div className="absolute bottom-[30%] left-[30%] flex items-center">
                  <div className="w-3.5 h-3.5 bg-red-500/80 rounded-full animate-pulse delay-500 shadow-lg shadow-red-500/30" />
                  <span className="ml-2 text-xs font-medium text-red-600/70">Access</span>
                </div>
                <div className="absolute bottom-[25%] right-[30%] flex items-center justify-end">
                  <span className="mr-2 text-xs font-medium text-primary/70">Knowledge</span>
                  <div className="w-2 h-2 bg-primary/90 rounded-full animate-pulse delay-700 shadow-lg shadow-primary/40" />
                </div>
              </div>
              
              {/* Main logo container */}
              <div className="relative group z-10">
                <div className="absolute -inset-1 bg-primary-gradient rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative glass-strong rounded-full p-8 shadow-2xl group-hover:shadow-glow transition-all duration-500 flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center">
                    <XenoraLogo className="transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Everyone Section */}
      <section className="relative section-padding bg-white">
        <div 
          ref={forEveryoneRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${forEveryoneRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-20">
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight transform transition-all duration-1000 ${forEveryoneRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Legal Help for
              <br />
              <span className="bg-primary-gradient bg-clip-text text-transparent">
                Every Life Situation
              </span>
            </h2>
            <p className={`text-2xl text-muted-foreground max-w-4xl mx-auto transform transition-all duration-1000 delay-300 ${forEveryoneRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Whether you're signing a lease, starting a job, buying a car, or facing any legal document - we're here to help
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lifeAreas.map((area, index) => (
              <div 
                key={index}
                className={`group transform transition-all duration-1000 ${forEveryoneRef.isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <Card className="relative bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:scale-102 overflow-hidden h-full">
                  <CardContent className="relative p-6 space-y-4 h-full flex flex-col">
                    <div className={`relative w-12 h-12 ${area.color} rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300`}>
                      <area.icon className="h-6 w-6" />
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {area.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-primary group-hover:text-primary/80 transition-colors duration-300 mt-auto">
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      <span className="ml-2 text-sm font-medium">Get Help</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button size="lg" asChild className="bg-primary-gradient hover:shadow-glow transition-all duration-300 text-white font-semibold border-0">
              <Link to="/for-canadians">
                Explore All Legal Areas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative section-padding bg-gradient-to-br from-background via-accent/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,77,79,0.2),transparent_50%)]" />
        
        <div 
          ref={featuresRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${featuresRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-20">
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight transform transition-all duration-1000 ${featuresRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              AI That Understands
              <br />
              <span className="bg-primary-gradient bg-clip-text text-transparent">
                Canadian Law
              </span>
            </h2>
            <p className={`text-2xl text-muted-foreground max-w-4xl mx-auto transform transition-all duration-1000 delay-300 ${featuresRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Trained on Canadian legislation, provincial differences, and real legal scenarios you face every day
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {canadianFeatures.map((feature, index) => (
              <div 
                key={index}
                className={`group transform transition-all duration-1000 ${featuresRef.isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
              >
                <Card className="relative bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group-hover:scale-102 overflow-hidden backdrop-blur-sm">
                  <CardContent className="relative p-8 space-y-6">
                    <div className="relative">
                      <div className="relative w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                        <feature.icon className="h-8 w-8 text-primary transition-all duration-300" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-primary group-hover:text-primary/80 transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      <span className="ml-2 text-sm font-medium">Try Now</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-swoosh section-padding bg-accent/5 shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
              Why Canadians Choose XenoraAI
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Built by Canadians, for Canadians - with the security, privacy, and bilingual support you deserve
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="transform transition-all duration-1000"
              >
                <Card className="relative bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden h-full backdrop-blur-sm">
                  <CardContent className="relative p-6 text-center space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="relative w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:scale-105 transition-all duration-300">
                          <benefit.icon className="h-8 w-8 text-primary transition-all duration-300" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative section-padding bg-primary-gradient overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div 
          ref={ctaRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-animate ${ctaRef.isVisible ? 'visible' : ''}`}
        >
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight transform transition-all duration-1000 ${ctaRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                Ready to Know Your Rights?
              </h2>
              <p className={`text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto transform transition-all duration-1000 delay-200 ${ctaRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                Join thousands of Canadians who've discovered the power of accessible legal knowledge
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-1000 delay-400 ${ctaRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <Button size="lg" variant="outline" asChild className="bg-white text-primary border-white hover:bg-gray-100 hover:text-primary font-semibold">
                <Link to="/for-canadians">Start For Free</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="glass-button text-white border-white/20 hover:bg-white/10">
                <Link to="/contact">Talk to Our Team</Link>
              </Button>
            </div>

            <div className={`pt-8 transform transition-all duration-1000 delay-600 ${ctaRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;