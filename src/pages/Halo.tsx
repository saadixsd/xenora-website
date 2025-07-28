import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Building, 
  BarChart3, 
  Calendar, 
  FileText, 
  Users, 
  DollarSign,
  Shield,
  Clock,
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Bot,
  Settings,
  Lock
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTranslation } from 'react-i18next';

const Halo = () => {
  const heroRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();
  const useCasesRef = useScrollAnimation();
  const { t } = useTranslation();
  const whyRef = useScrollAnimation();
  const features = [
    "Case and client management system powered by Nora",
    "Secure document vault with tagging and versioning",
    "Smart calendar with legal deadlines and task scheduling",
    "Billing and invoicing with automated time tracking",
    "Client portal for appointments and invoice access",
    "Integration with Google Drive and Office365 (Available Q4 2025)",
    "Role-based access controls for team management"
  ];

  const dashboardStats = [
    { icon: FileText, label: "Active Cases", value: "15", change: "+3" },
    { icon: DollarSign, label: "This Month", value: "$32K", change: "+25%" },
    { icon: BarChart3, label: "Efficiency", value: "95%", change: "+10%" },
    { icon: Users, label: "Active Clients", value: "50", change: "+15" },
    { icon: FileText, label: "Documents", value: "1,200", change: "+200" },
    { icon: Bot, label: "Queries/Mo", value: "150", change: "+30%" }
  ];

  const useCases = [
    {
      icon: FileText,
      title: "Case Management",
      description: "Track cases with Nora-powered insights and real-time updates.",
      highlight: "Centralized workflow"
    },
    {
      icon: DollarSign,
      title: "Billing & Invoicing",
      description: "Automate billing with Nora's time tracking integration.",
      highlight: "Automated billing"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Manage legal deadlines and tasks with Nora's automation.",
      highlight: "AI-powered reminders"
    },
    {
      icon: Users,
      title: "Client Portal",
      description: "Secure client access for invoices and appointments.",
      highlight: "Client self-service"
    },
    {
      icon: Lock,
      title: "Document Vault",
      description: "Securely store and manage documents with tagging.",
      highlight: "Secure storage"
    },
    {
      icon: Settings,
      title: "Team Collaboration",
      description: "Role-based access controls enable secure team collaboration.",
      highlight: "Team management"
    }
  ];

  const whyHalo = [
    {
      icon: Building,
      title: "Case & Client Management",
      description: "Centralized system with Nora's insights for efficient case tracking."
    },
    {
      icon: Shield,
      title: "Secure Document Vault",
      description: "Organize and secure case files with tagging and versioning."
    },
    {
      icon: Calendar,
      title: "Smart Calendar",
      description: "Automated scheduling with legal deadlines and Nora's task reminders."
    },
    {
      icon: DollarSign,
      title: "Billing & Invoicing",
      description: "Automated time tracking and one-click invoice creation."
    },
    {
      icon: Users,
      title: "Client Portal",
      description: "Secure portal for clients to access invoices and book appointments."
    },
    {
      icon: Settings,
      title: "Third-Party Integrations",
      description: "Seamless connectivity with Google Drive and Office365."
    }
  ];

  return (
    <div className="min-h-screen page-fade-in">
      {/* Header */}
      <section className="section-padding bg-hero-gradient shadow-elegant">
        <div 
          ref={heroRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${heroRef.isVisible ? 'visible' : ''}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-swoosh-in">
              <Badge variant="outline" className="w-fit hover-scale">
                <Building className="h-3 w-3 mr-1" />
                Legal Operating Suite
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in-up">
                  Welcome to
                  <br />
                  <span className="bg-primary-gradient bg-clip-text text-transparent">
                    Halo
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  The AI-powered legal operating suite, embedding Nora's intelligence into case management, 
                  billing, scheduling & many other tasks. Manage everything in one Operating System.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-primary-gradient hover:shadow-glow transition-all duration-300">
                  <Link to="/contact">
                    Join Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>

              <Badge variant="secondary" className="w-fit">
                <Clock className="h-3 w-3 mr-1" />
                Launching Q4 2025
              </Badge>
            </div>

            {/* Dashboard Preview */}
            <Card className="bg-card-gradient border-primary/10 shadow-primary hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span>Your Dashboard</span>
                </CardTitle>
                <CardDescription>Halo's Integrated Legal Dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {dashboardStats.map((stat, index) => (
                    <div key={index} className="bg-accent/50 rounded-lg p-3 text-center hover-scale">
                      <div className="flex items-center justify-center mb-2">
                        <stat.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-lg font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                      <div className="text-xs text-primary">{stat.change}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
              Complete Legal Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Halo, powered by Nora AI, is tailored for Canadian legal professionals to optimize workflows.
            </p>
          </div>

          <Card className="bg-card-gradient border-primary/10 hover-lift">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>Everything you need for complete practice management</CardDescription>
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
              Halo Use Cases
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how Halo transforms legal workflows for various users.
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
                  <Badge variant="outline" className="text-xs">{useCase.highlight}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Halo */}
      <section className="section-swoosh section-padding bg-background">
        <div 
          ref={whyRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${whyRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Halo
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Halo, powered by Nora AI, is tailored for Canadian legal professionals to optimize workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyHalo.map((reason, index) => (
              <div key={index} className="text-center space-y-4 hover-scale">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto hover:bg-primary/20 transition-colors">
                  <reason.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Info */}
      <section className="section-padding bg-primary-gradient shadow-elegant">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-scale-in">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Halo: Launching Q4 2025</span>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">
              Be Among the First
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join the waitlist to be among the first to experience Halo's powerful legal suite, 
              integrated with Nora AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-foreground hover:bg-white/90 hover-scale" asChild>
                <Link to="/contact">
                  Join Waitlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white hover-scale" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">October 2025</div>
                <div className="text-white/80">Full Release</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">Q4 2025</div>
                <div className="text-white/80">Integrations</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Halo;