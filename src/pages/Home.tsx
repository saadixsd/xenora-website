import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Bot,
  Sparkles, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Scale,
  FileText,
  Search,
  Zap
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import XenoraLogo from "@/components/XenoraLogo";

const Home = () => {
  const heroRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();
  const benefitsRef = useScrollAnimation();
  
  const features = [
    {
      icon: Scale,
      title: "Case Law Analysis",
      description: "Access relevant Canadian case law with AI-powered insights, customized to your specific legal needs."
    },
    {
      icon: FileText,
      title: "Document Review",
      description: "Automate document analysis with instant summarization and key point extraction, saving hours of work."
    },
    {
      icon: Search,
      title: "CanLII Integration",
      description: "Seamlessly connect to Canada's leading legal database for smarter, faster research."
    },
    {
      icon: Zap,
      title: "RAG-Powered Assistant",
      description: "Our Retrieval-Augmented Generation model delivers fast, accurate answers from trusted legal sources."
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Provincial Expertise",
      description: "Solutions that understand regional legal nuances across Canada."
    },
    {
      icon: Sparkles,
      title: "Bilingual Support",
      description: "Full functionality in French and English, ensuring accessibility nationwide."
    },
    {
      icon: Shield,
      title: "Ethical AI",
      description: "Built with Canadian legal ethics and compliance to enhance user trust."
    },
    {
      icon: Clock,
      title: "Real-time Results",
      description: "Get answers in seconds, not hours. Optimize your workflow efficiency."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient section-padding shadow-elegant">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div 
          ref={heroRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${heroRef.isVisible ? 'visible' : ''}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-swoosh-in">
              <Badge variant="outline" className="w-fit border-primary/20 text-primary hover-scale">
                <Sparkles className="h-3 w-3 mr-1" />
                Legal Solutions & Automation
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Everyone
                  <br />
                  Deserves An
                  <br />
                  <span className="bg-primary-gradient bg-clip-text text-transparent">
                    Advocate
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Leading Legal AI solutions & delivering Automation & Insights for 
                  Professionals & Individuals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-primary-gradient hover:shadow-glow transition-all duration-300">
                  <Link to="/models">
                    Explore Our Models
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Discover XenoraAI</Link>
                </Button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 animate-slide-up">
              <Card className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Case Analysis</h3>
                  <p className="text-sm text-muted-foreground">AI-Powered Research</p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Document Review</h3>
                  <p className="text-sm text-muted-foreground">Instant Analysis</p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">CanLII Integration</h3>
                  <p className="text-sm text-muted-foreground">Smart Search</p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Procedural Guidance</h3>
                  <p className="text-sm text-muted-foreground">Step-by-Step Legal Help</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>


      {/* Benefits Section */}
      <section className="section-swoosh section-padding bg-accent/30 shadow-elegant">
        <div 
          ref={benefitsRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${benefitsRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Leading AI Innovation in Canadian Law
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              XenoraAI is revolutionizing AI legal solutions, designed to meet the unique needs of Canada's legal community & its people.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center space-y-4 hover-scale group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-gradient shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-scale-in">
            <h2 className="text-4xl font-bold text-white mb-4">
              Transform Your Legal Practice
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Access Canada's most advanced legal AI tools. Join the waitlist and be among the first to experience Nora and Halo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="hover-scale">
                <Link to="/login">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white hover-scale" asChild>
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;